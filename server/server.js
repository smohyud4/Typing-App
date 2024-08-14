import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import axios from "axios";
import jwt from 'jsonwebtoken';
import cors from 'cors';
import cookieParser from "cookie-parser";
import env from "dotenv";
import { initializeCharQuery, updateQueries } from "./queries.js";

env.config();
const app = express();
const port = process.env.PORT || 5000;
const saltRounds = process.env.SALT_ROUNDS;
const SECRET_KEY = process.env.SECRET_KEY;

const db = new pg.Client({
    user: process.env.PG_USER,
    host:  process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
});
//db.connect();


app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH"],
    credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

function verifyUser(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({error: "Unauthorized"});

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({error: "Unauthorized"});
        req.user = decoded.user;
        next();
    });
}

app.get("/", (req, res) => {
    res.send("Hello Typers!");
});

app.get("/authorize", verifyUser, async (req, res) => {
    res.json({user: req.user});
});

app.get("/account", verifyUser, async (req, res) => {

    const user = req.user;

    try {
        const result = await db.query("SELECT * FROM character_stats WHERE user_name = $1", [user]);

        if (result.rowCount == 0) {
            const query = initializeCharQuery();
            await db.query(query, [user]);
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({error: "Error fetching user data"});
    } 

    try {
        const result = await db.query("SELECT * FROM users WHERE username = $1", [user]);
        const data = result.rows[0];

        const accuracies = await db.query("SELECT character, total_typed, total_correct FROM character_stats WHERE user_name = $1", [user]);
        
        const userData = {
            races: data.total_races,
            WPM: data.total_wpm,
            bestWPM: data.best_wpm,
            accuracy: data.total_accuracy,
            user: user,
            charAccuracies: accuracies.rows
        }

        res.json(userData);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({error: "Error fetching user data"});
    }
});

app.get("/random-text", async (req, res) => {
   
    const limit = Math.random() < 0.6 ? 2 : 3;
    const options = {
        method: 'GET',
        url: 'https://api.api-ninjas.com/v1/facts?limit=' + limit,
        headers: {
            'X-Api-Key': process.env.API_KEY
        }
    };

    try {
        const response = await axios.request(options);
        res.json({text: response.data});
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({error: "Error fetching text"});
    }
});

app.get("/logout", (req, res) => {
    res.clearCookie('token');
    res.json({message: "Logged out"});
});

app.post("/register", async (req, res) => {
    try {
        const {username, email, password} = req.body;
        const checkUser = await db.query("SELECT * FROM users WHERE email = $1 OR username = $2", [email, username]);
        if (checkUser.rows.some(row => row.email === email)) {
            return res.json({ error: "Email already registered" });
        } 
        else if (checkUser.rows.some(row => row.username === username)) {
            return res.json({ error: "Username already taken" });
        }
        else {
            bcrypt.hash(password, saltRounds, async(err, hash) => {
                if (err) {
                    console.log("Error with hashing password registering:" + err);
                    return res.status(500).json({ error: "Error processing request" });
                }
                await db.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3)", 
                [username, email, hash]);
                res.status(201).json({message: "Successfully registered!"});
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({error: "Error signing up"});
    }
});

app.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;
        const data = await db.query("SELECT * FROM users WHERE email = $1", [email]);

        if (data.rowCount == 0) {
            res.status(201).json({error: "User not found"});
        }
        else {
          console.log(data.rows);
          let storedPassword = data.rows[0].password;
          bcrypt.compare(password, storedPassword, (err, result) => {
            if (err) {
              console.log("Error with hashing password logging in:" + err);
              return res.status(500).json({ error: "Error processing request" });
            }
            if (!result) return res.status(201).json({error: "Incorrect password"});
            
            const user = data.rows[0].username;
            const token = jwt.sign({user}, SECRET_KEY, {expiresIn: '1hr'});
            res.cookie('token', token, {httpOnly: true});
            res.json({message: "Succesfully logged in"});
          });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({error: "Error signing in"});
    }
});

app.patch("/race", verifyUser, async (req, res) => {
    const user = req.user;
    const {currWpm, currAccuracy, chars} = req.body;
    const [userQuery, charQueries] = updateQueries(chars);

    try {
        await db.query(userQuery, [user, currWpm, currAccuracy]);
        for (const query of charQueries) await db.query(query, [user]); 
        res.json({message: "Successfully updated"});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({error: "Error updating"});
    } 
});

app.listen(port, () => {
    console.log("Server is running on port " + port);
})


