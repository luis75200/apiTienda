const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: String,
  precio: {
    type: Number,
    required: true
  },
  moneda: {
    type: String,
    default: 'Q'
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria',
    required: true
  },
  activa: {
    type: Boolean,
    default: true
  },
  imagenes: [
    {
      type: String,
      trim: true
    }
  ],
  creadoEn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Producto || mongoose.model('Producto', productoSchema);
