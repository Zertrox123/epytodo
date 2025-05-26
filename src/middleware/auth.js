const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "12345678";

function authenticateToken(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth) {
        return res.status(401).json({ msg: "Token missing" });
    }
    jwt.verify(auth, SECRET_KEY, (err, payload) => {
        if (err) {
            return res.status(403).json({ msg: "Invalid token" });
        }
        req.user = payload;
        next();
    });
}

module.exports = authenticateToken;