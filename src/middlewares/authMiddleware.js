const jwt = require('jsonwebtoken');
require('dotenv').config();
const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Lấy token sau 'Bearer'

        if (!token) {
            return res.status(401).json({ error: 'Access token is missing or invalid' });
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ error: 'Invalid or expired token' });
            }

            req.user = user; // Thêm thông tin người dùng vào yêu cầu
            next(); // Tiếp tục xử lý yêu cầu
        });
    } catch (error) {
        next(error)
    }
};

module.exports = {
    authenticateToken
}
