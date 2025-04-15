// middleware/auth.js
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET; // cámbiala o usa dotenv

function auth(req, res, next) {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Acceso denegado' });

  try {
    const verified = jwt.verify(token, SECRET);
    req.usuario = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Token inválido' });
  }
}

module.exports = auth;
