const express = require("express");
const mysql = require("mysql2");

const app = express();

app.use(express.json());

const db = mysql.createConnection({

    host: process.env.DB_HOST,

    port: process.env.DB_PORT,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME

});


db.connect((err) => {

    if (err) {

        console.error("Database connection failed:", err);

        return;

    }

    console.log("Connected to MySQL");

    db.query(`

        CREATE TABLE IF NOT EXISTS conversations (

            id INT AUTO_INCREMENT PRIMARY KEY,

            user_message TEXT,

            bot_response TEXT,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        )

    `);

});


app.get("/", (req, res) => {

    res.json({
        message: "Chatbot backend is running"
    });

});


app.post("/chat", (req, res) => {

    const message = req.body.message;

    let reply = "I'm still learning. 🤖";


    if (message.toLowerCase().includes("hello")) {

        reply = "Hello! 👋 How can I help you?";

    }

    else if (message.toLowerCase().includes("kubernetes")) {

        reply =
        "Kubernetes is a container orchestration platform used to deploy, manage and scale containerized applications.";

    }

    else if (message.toLowerCase().includes("pod")) {

        reply =
        "A Pod is the smallest deployable unit in Kubernetes and usually contains one or more containers.";

    }

    else if (message.toLowerCase().includes("docker")) {

        reply =
        "Docker is a containerization platform used to package applications and their dependencies into containers.";

    }

    else if (message.toLowerCase().includes("service")) {

        reply =
        "A Kubernetes Service provides stable networking and access to a set of Pods.";

    }


    db.query(

        "INSERT INTO conversations (user_message, bot_response) VALUES (?, ?)",

        [message, reply],

        (err) => {

            if (err) {

                console.error(err);

            }

            res.json({
                reply: reply
            });

        }

    );

});


app.get("/conversations", (req, res) => {

    db.query(

        "SELECT * FROM conversations ORDER BY created_at DESC",

        (err, results) => {

            if (err) {

                return res.status(500).json({
                    error: err.message
                });

            }

            res.json(results);

        }

    );

});


app.listen(3000, () => {

    console.log("Chatbot backend running on port 3000");

});
