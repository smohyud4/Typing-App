import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import cors from 'cors';
import cookieParser from "cookie-parser";

const app = express();
const port = 5000;
const saltRounds = 10;
const SECRET_KEY = "Trweashedeeze123**";

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Typing",
    password: "baraka46",
    port: 5432,
});
db.connect();


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


app.get("/account", verifyUser, async (req, res) => {

    const user = req.user;

    try {
        const result = await db.query("SELECT * FROM users WHERE username = $1", [user]);
        const data = result.rows[0];
        console.log(data);
        
        const userData = {
            races: data.total_races,
            WPM: data.total_wpm,
            bestWPM: data.best_wpm,
            accuracy: data.total_accuracy,
            user: user
        }

        res.json(userData);
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500).json({error: "Error fetching user data"});
    }
    //res.json({user: req.user});
});

app.get("/logout", (req, res) => {
    res.clearCookie('token');
    res.json({message: "Logged out"});
});


app.post("/register", async (req, res) => {
    try {
        const {email, password} = req.body;
        const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);

        if (checkResult.rowCount > 0) {
            res.status(201).json({error: "Email already registered"})
        } 
        else {
            bcrypt.hash(password, saltRounds, async(err, hash) => {
                if (err) {
                    console.log("Error with hashing password registering:" + err);
                    return;
                }
                const autoUserName = email + Math.floor(Math.random() * 1000);
                await db.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3)", 
                [autoUserName, email, hash]);
                res.status(201).json({message: "Successfully registered!"});
            });
        }
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500).json({error: "Error signing up"});
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
              return;
            }
            console.log(result);
            if (!result) return res.status(201).json({error: "Incorrect password"});
            
            const user = data.rows[0].username;
            const token = jwt.sign({user}, SECRET_KEY, {expiresIn: '1hr'});
            res.cookie('token', token);
            res.json({message: "Succesfully logged in"});
          });
        }
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500).json({error: "Error signing in"});
    }
});

app.patch("/race", verifyUser, async (req, res) => {
    const user = req.user;
    console.log(req.body);
    const {currWpm, currAccuracy} = req.body;

    const queries = [

        `UPDATE users 
         SET 
          total_races = total_races + 1
          best_wpm = GREATEST(best_wpm, $2), 
          total_wpm = total_wpm + $2, 
          total_accuracy = total_accuracy + $3, 
        WHERE 
          username = $1
       `,

       `CHAR_ACCURACIES`,
    ];

    try {
        await db.query(queries[0], [user, currWpm, currAccuracy]);
        res.json({message: "Successfully updated"});
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500).json({error: "Error updating"});
    } 

});

app.listen(port, () => {
    console.log("Server is running on port " + port);
})