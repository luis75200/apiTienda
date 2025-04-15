const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const SECRET = process.env.JWT_SECRET;

// Registrar usuario
router.post('/register', async (req, res) => {
  try {
    const { nombre, correo, contrasena, rol } = req.body;

    const existe = await Usuario.findOne({ correo });
    if (existe) return res.status(400).json({ error: 'Correo ya registrado' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(contrasena, salt);

    const nuevoUsuario = new Usuario({ nombre, correo, contrasena: hash, rol });
    await nuevoUsuario.save();

    res.status(201).json({ mensaje: 'Usuario registrado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    const usuario = await Usuario.findOne({ correo });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    const esValido = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!esValido) return res.status(400).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token, usuario: { id: usuario._id, nombre: usuario.nombre, rol: usuario.rol } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
