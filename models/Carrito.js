const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  productoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto',
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1
  }
});

const carritoSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    unique: true, // un solo carrito por usuario
    required: true
  },
  productos: [itemSchema],
  actualizadoEn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Carrito || mongoose.model('Carrito', carritoSchema);