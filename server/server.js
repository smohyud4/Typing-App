import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import cors from 'cors';

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

const test = [1, 2, 3, 4];

app.use(cors());
app.use(bodyParser.json());

app.get("/test", (req, res) => {
    console.log("Request made");
    res.json(test);
});

app.post("/register", async(req, res) => {
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

app.post("/login", async(req, res) => {
    try {
        const {email, password} = req.body;
        const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);

        if (user.rowCount == 0) {
            res.status(201).json({error: "User not found"});
        }
        else {
          console.log(user.rows);
          let storedPassword = user.rows[0].password;
          bcrypt.compare(password, storedPassword, (err, result) => {
            if (err) {
              console.log("Error with hashing password logging in:" + err);
              return;
            }
            console.log(result);
            if (!result) return res.status(201).json({error: "Incorrect password"});
            
            const token = jwt.sign({userId: user.rows[0].id}, SECRET_KEY, {expiresIn: '1hr'});
            res.json({message: "Succesfully logged in"});
          });
        }
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500).json({error: "Error signing in"});
    }
});

app.listen(port, () => {
    console.log("Server is running on port " + port);
})