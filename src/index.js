require("dotenv").config({ path: __dirname + "/../.env" });
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const mysql = require("mysql2");


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error("Internal server error", err);
        process.exit(1);
    }
    app.use(express.json());
    const authenticateToken = require("./middleware/auth");
    const userRoutes = require("./routes/user/user");
    const loginRoutes = require("./routes/auth/auth");
    const todoRoutes = require("./routes/todos/todos");
    app.use("/", userRoutes(authenticateToken, db));
    app.use("/", loginRoutes(db));
    app.use("/", todoRoutes(db));
    app.listen(port, () => {
    });
});
