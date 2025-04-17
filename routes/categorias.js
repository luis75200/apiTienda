const express = require('express');
const router = express.Router();
const Categoria = require('../models/Categoria');
const auth = require('../middleware/auth');

// Crear una categoría
router.post('/', auth, async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const categoria = new Categoria({ nombre, descripcion });
    await categoria.save();
    res.status(201).json(categoria);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener todas las categorías
router.get('/', async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar una categoría
router.put('/:id', auth, async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(categoria);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar una categoría
router.delete('/:id', auth, async (req, res) => {
  try {
    await Categoria.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Categoría eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
