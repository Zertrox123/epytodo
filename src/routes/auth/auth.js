const express = require("express");
const jwt = require("jsonwebtoken");

module.exports = (db) => {
    const router = express.Router();
    const SECRET_KEY = process.env.JWT_SECRET || "12345678";

    router.post("/register", (req, res) => {
        const email = req.body.email;
        const name = req.body.name;
        const firstname = req.body.firstname;
        const password = req.body.password;
        const sql = `
            INSERT INTO user (email, name, firstname, password)
            VALUES (?, ?, ?, ?)
        `;
        db.query(sql, [email, name, firstname, password], (err, result) => {
            if (err) {
                return res.status(500).json({ msg: "Account already exists" });
            }
            const userId = result.insertId;
            const token = jwt.sign({ id: userId, email }, SECRET_KEY, { expiresIn: "1h" });
            res.status(201).json({token});
        });
    });
    router.post("/login", (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        const sql = "SELECT * FROM user WHERE email = ?";
        db.query(sql, [email, password], (err, result) => {
            if (err) {
                return res.status(500).json({ msg: "Internal server error" });
            }
            if (result.length === 0) {
                return res.status(401).json({ msg: "Invalid Credentials" });
            }
            const user = result[0];
            if (user.password !== password) {
                return res.status(401).json({ msg: "Invalid Credentials" });
            }
            const userId = user.id;
            const token = jwt.sign({ id: userId, email }, SECRET_KEY, { expiresIn: "1h" });
            res.status(201).json({token});
        });
    });
    return router;
};
