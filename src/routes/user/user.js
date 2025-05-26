const express = require("express");
const jwt = require("jsonwebtoken");

module.exports = (authenticateToken, db) => {
    const router = express.Router();
    const SECRET_KEY = process.env.JWT_SECRET || "12345678";

    router.get("/me", authenticateToken, (req, res) => {
        const userId = req.user.id;
        const sql = "SELECT id, email, password, name, firstname FROM user WHERE id = ?";
        db.query(sql, [userId], (err, results) => {
            if (err) {
                return res.status(500).json({ msg: "Internal server error" });
            }
            if (results.length === 0) {
                return res.status(404).json({ msg: "User not found" });
            }
            res.status(200).json(results[0]);
        });
    });
    router.get("/user", authenticateToken, (req, res) => {
        const sql = "SELECT * FROM todo";
        db.query(sql, (err, results) => {
            if (err) {
                return res.status(500).json({ msg: "Internal server error" });
            }
            res.status(200).json(results);
        });
    });
    router.get("/user/:id", authenticateToken, (req, res) => {
        const userId = req.params.id;
        const sql = "SELECT id, email, password, name, firstname FROM user WHERE id = ?";
        db.query(sql, [userId], (err, results) => {
            if (err) {
                return res.status(500).json({ msg: "Internal server error" });
            }
            if (results.length === 0) {
                return res.status(404).json({ msg: "User not found" });
            }
            res.status(200).json(results[0]);
        });
    });
    router.get("/user/:email", authenticateToken, (req, res) => {
        const userId = req.params.email;
        const sql = "SELECT id, email, password, name, firstname FROM user WHERE id = ?";
        db.query(sql, [userId], (err, results) => {
            if (err) {
                return res.status(500).json({ msg: "Internal server error" });
            }
            if (results.length === 0) {
                return res.status(404).json({ msg: "User not found" });
            }
            res.status(200).json(results[0]);
        });
    });
    return router;
};