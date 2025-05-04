const jwt = require('jsonwebtoken');

// middlewares/userAuth.js
const userAuth = (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.json({ success: false, message: 'Authentication token not found' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.id) {
            req.userId = decoded.id; // ✅ Attach to request object
        } else {
            return res.json({ success: false, message: 'Invalid token' });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};


module.exports = userAuth;