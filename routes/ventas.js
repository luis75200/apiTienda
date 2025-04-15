const express = require('express');
const router = express.Router();
const Venta = require('../models/Venta');
const Producto = require('../models/Producto');
const auth = require('../middleware/auth');

// Crear venta
router.post('/', auth, async (req, res) => {
  try {
    const { productos } = req.body;

    if (!productos || productos.length === 0) {
      return res.status(400).json({ error: 'Debe incluir al menos un producto' });
    }

    let total = 0;

    // Validar productos y existencias
    const detalles = await Promise.all(productos.map(async (item) => {
      const producto = await Producto.findById(item.producto);
      if (!producto) throw new Error(`Producto no encontrado: ${item.producto}`);

      // Verificar que haya suficiente stock
      if (producto.stock < item.cantidad) {
        throw new Error(`No hay suficiente stock para el producto: ${producto.nombre}`);
      }

      const subtotal = producto.precio * item.cantidad;
      total += subtotal;

      return {
        producto: producto._id,
        cantidad: item.cantidad,
        precioUnitario: producto.precio
      };
    }));

    // Crear la venta
    const nuevaVenta = new Venta({
      vendedor: req.usuario.id,
      productos: detalles,
      total
    });

    await nuevaVenta.save();

    // Actualizar el stock de los productos vendidos
    await Promise.all(detalles.map(async (item) => {
      const producto = await Producto.findById(item.producto);
      if (producto) {
        producto.stock -= item.cantidad;
        await producto.save();
      }
    }));

    res.status(201).json(nuevaVenta);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener todas las ventas
router.get('/', auth, async (req, res) => {
  try {
    const ventas = await Venta.find()
      .populate('vendedor', 'nombre')
      .populate('productos.producto', 'nombre precio');

    res.json(ventas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
