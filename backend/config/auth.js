const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY; 

// Función para generar un token
const generateToken = (user) => {
    return jwt.sign(
        { userId: user.idUsuarios, userName: user.nombre, userRole: user.idRol },
        secretKey,
        { expiresIn: '24h' }
    );
};

// Middleware para verificar el token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // Si no hay token, respuesta 401

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403); // Si el token no es válido, respuesta 403
        req.user = user;
        next();
    });
};

const authorizeRole = (roles) => {
    
    return (req, res, next) => {
        if (!roles.includes(req.user.userRole)) {
            return res.status(403).json({ message: 'Acceso denegado' });
        }
        next();
    };
};

module.exports = { generateToken, authenticateToken, authorizeRole };
