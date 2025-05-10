const express = require('express');
const router = express.Router();
const Category = require('../models/Categoria')

router.get('/', async (req,res) => {
    try {
        const userAgent = req.headers['user-agent'];
    
        let categoriass;

        if (userAgent && userAgent.includes('Postman')) {
            categoriass = await Category.find({}, { _id: 0, date_created: 0, date_creates: 0});
        } else {
            categoriass = await Category.find();
        }
        res.json(categoriass);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener productos');
    }
});

// POST - Crear una nueva categoría
router.post('/', async (req, res) => {
    try {
        const nuevaCategoria = new Category(req.body);
        await nuevaCategoria.save();
        res.status(201).json(nuevaCategoria);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// PUT - Actualizar una categoría completa
router.put('/:id', async (req, res) => {
    try {
        const actualizado = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, overwrite: true, runValidators: true }
        );
        res.status(200).json(actualizado);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// PATCH - Actualizar parcialmente un producto
router.patch('/:id', async (req, res) => {
    try{
        const actualizado =  await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true}
        );
        res.status(200).json(actualizado);
    } catch(e){
        res.status(500).json({ error: e.message });
    }
});

// DELETE - Eliminar un producto
router.delete('/:id', async (req, res) => {
    try{
        const eliminado = await Category.findByIdAndDelete(req.params.id);
        res.status(200).json(eliminado);
    }catch(e){
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;