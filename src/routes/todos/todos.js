const express = require("express");
const jwt = require("jsonwebtoken");

module.exports = (db) => {
    const router = express.Router();
    const SECRET_KEY = process.env.JWT_SECRET || "12345678";

    router.post("/todos", authenticateToken, (req, res) => {
        const title = req.body.title;
        const description = req.body.description;
        const due_time = req.body.due_time;
        const user_id = req.body.user_id;
        const sql = `
            INSERT INTO todo (title, description, due_time, user_id)
            VALUES (?, ?, ?, ?)
        `;
        db.query(sql, [title, description, due_time, user_id], (err, result) => {
            if (err) {
                return res.status(500).json({ msg: "Internal server error" });
            }
            const newTodo = {
                id: result.insertId,
                title,
                description: description,
                due_time,
                status: "not started",
                user_id
            };
            res.status(201).json({newTodo});
        });
    });
    router.get("/todos", authenticateToken, (req, res) => {
        const sql = "SELECT * FROM todo";
        db.query(sql, (err, results) => {
            if (err) {
                return res.status(500).json({ msg: "Internal server error" });
            }
            res.status(200).json(results);
        });
    });
    router.get("/todo/:id", authenticateToken, (req, res) => {
        const todoId = req.params.id;
        const sql = "SELECT * FROM todo WHERE id = ?";
        db.query(sql, [todoId], (err, results) => {
            if (err) {
                return res.status(500).json({ msg: "Internal server error" });
            }
            if (results.length === 0) {
                return res.status(404).json({ msg: "Todo not found" });
            }
            res.status(200).json(results[0]);
        });
    });
    return router;
};
