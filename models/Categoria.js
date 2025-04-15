const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  descripcion: {
    type: String,
    default: ''
  },
  activa: {
    type: Boolean,
    default: true
  },
  creadaEn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Categoria || mongoose.model('Categoria', categoriaSchema);
