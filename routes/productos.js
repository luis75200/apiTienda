const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const Categoria = require('../models/Categoria');
const auth = require('../middleware/auth');
// Crear producto
router.post('/', auth, async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, categoria } = req.body;

    // Verificar que la categoría exista
    const cat = await Categoria.findById(categoria);
    if (!cat) return res.status(400).json({ error: 'Categoría no válida' });

    const nuevoProducto = new Producto({ nombre, descripcion, precio, stock, categoria });
    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener todos los productos (con nombre de categoría)
router.get('/', auth, async (req, res) => {
  try {
    const productos = await Producto.find().populate('categoria', 'nombre');
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener un producto por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id).populate('categoria', 'nombre');
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar producto
router.put('/:id', auth, async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, activa, categoria } = req.body;

    // Verificar que la categoría exista si viene en la actualización
    if (categoria) {
      const cat = await Categoria.findById(categoria);
      if (!cat) return res.status(400).json({ error: 'Categoría no válida' });
    }

    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      { nombre, descripcion, precio, stock, activa, categoria },
      { new: true }
    );

    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

    res.json(producto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar producto
router.delete('/:id', auth, async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
