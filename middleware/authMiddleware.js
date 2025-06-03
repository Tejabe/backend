const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('Incoming request body:', req.body);
        return res.status(401).json({ message: 'Access denied, no token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request
        next();
    } catch (error) {
        console.error('JWT Authentication Error:', error.message); // Log error for debugging
        console.log('Incoming request body:', req.body);

        return res.status(401).json({
            message: error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token',
        });
    }
};

module.exports = authMiddleware;