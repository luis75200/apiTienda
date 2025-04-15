const express = require('express');
const router = express.Router();
const Carrito = require('../models/Carrito');
const auth = require('../middleware/auth');
const Producto = require('../models/Producto');


// GET /api/carrito
router.get('/carrito', auth, async (req, res) => {
    try {
      const carrito = await Carrito.findOne({ usuarioId: req.usuario.id }).populate('productos.productoId');
      if (!carrito) return res.json({ productos: [] });
      res.json(carrito);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener el carrito' });
    }
  });

  // POST /api/carrito/agregar
router.post('/carrito/agregar', auth, async (req, res) => {
    const { productoId, cantidad } = req.body;
    try {        
        let carrito = await Carrito.findOne({ usuarioId: req.usuario.id });
        
        if (!carrito) {
          carrito = new Carrito({ usuarioId: req.usuario.id, productos: [] });
        }
        
        // Validar cantidad disponible
        const producto = await Producto.findById(productoId);
        if (!producto) {
          return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        const itemExistente = carrito.productos.find(p => p.productoId.toString() === productoId);
        let cantidadTotal = cantidad;
        
        if (itemExistente) {
          cantidadTotal += itemExistente.cantidad;
        }
        
        if (cantidadTotal > producto.cantidadDisponible) {
          return res.status(400).json({ error: `Solo hay ${producto.cantidadDisponible} unidades disponibles` });
        }
        
        // Agregar o actualizar en el carrito
        if (itemExistente) {
          itemExistente.cantidad += cantidad;
        } else {
          carrito.productos.push({ productoId, cantidad });
        }
        
        carrito.actualizadoEn = Date.now();
        await carrito.save();
        
        res.json(carrito);
        
    } catch (err) {
      res.status(500).json({ error: 'Error al agregar al carrito' });
    }
  });

  // PUT /api/carrito/actualizar
router.put('/carrito/actualizar', auth, async (req, res) => {
    const { productoId, cantidad } = req.body;
    try {
      const carrito = await Carrito.findOne({ usuarioId: req.usuario.id });
      if (!carrito) return res.status(404).json({ error: 'Carrito no encontrado' });
  
      const item = carrito.productos.find(p => p.productoId.toString() === productoId);
      if (!item) return res.status(404).json({ error: 'Producto no está en el carrito' });
  
      item.cantidad = cantidad;
      carrito.actualizadoEn = Date.now();
      await carrito.save();
  
      res.json(carrito);
    } catch (err) {
      res.status(500).json({ error: 'Error al actualizar el carrito' });
    }
  });

  // DELETE /api/carrito/eliminar/:productoId
router.delete('/carrito/eliminar/:productoId', auth, async (req, res) => {
    const { productoId } = req.params;
    try {
      const carrito = await Carrito.findOne({ usuarioId: req.usuario.id });
      if (!carrito) return res.status(404).json({ error: 'Carrito no encontrado' });
  
      carrito.productos = carrito.productos.filter(p => p.productoId.toString() !== productoId);
      carrito.actualizadoEn = Date.now();
      await carrito.save();
  
      res.json(carrito);
    } catch (err) {
      res.status(500).json({ error: 'Error al eliminar producto del carrito' });
    }
  });
  
  
  