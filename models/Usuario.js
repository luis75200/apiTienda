const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  correo: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  contrasena: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    enum: ['admin', 'vendedor', 'cliente'],
    default: 'cliente'
  },
  creadoEn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Usuario || mongoose.model('Usuario', usuarioSchema);
