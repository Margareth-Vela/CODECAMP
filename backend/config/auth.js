const jwt = require('jsonwebtoken');
const sequelize = require('../config/database.js');
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
const authenticateToken = async(req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

  try {
    // Verificar si el token está en la lista negra
    const [results] = await sequelize.query(`
      SELECT 1 FROM RevokedTokens WHERE token = :token
    `, {
      replacements: { token }
    });

    if (results.length > 0) {
      return res.status(403).json({ message: 'Token revocado' });
    }

    // Verificar el token JWT
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Token expirado' });
        } else {
          return res.status(403).json({ message: 'Token inválido' });
        }
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Error al verificar token:', error);
    res.status(500).json({ message: 'Error al verificar el token' });
  }
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
