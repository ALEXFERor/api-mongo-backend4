const express = require('express');
const router = express.Router();
const Vent = require('../models/Venta');
const Producto = require('../models/Producto');



async function generarNumeroSerie(tipoDocumento) {
    const prefix = tipoDocumento === 'factura' ? 'F-' : 'B-';
  
    const ultimaVenta = await Vent.findOne({ tipo_documento: tipoDocumento })
      .sort({ num_serie: -1 })
      .exec();
  
    if (!ultimaVenta) return `${prefix}001`;
  
    const ultimoNumero = parseInt(ultimaVenta.num_serie.replace(prefix, ''));
    const nuevoNumero = ultimoNumero + 1;
    return `${prefix}${String(nuevoNumero).padStart(3, '0')}`;
  }


// Función para generar número de serie
async function generarNumeroSerie(tipoDocumento) {
    const prefix = tipoDocumento === 'factura' ? 'F-' : 'B-';

    const ultimaVenta = await Vent.findOne({ tipo_documento: tipoDocumento })
        .sort({ num_serie: -1 })
        .exec();

    if (!ultimaVenta) return `${prefix}001`;

    const ultimoNumero = parseInt(ultimaVenta.num_serie.replace(prefix, ''));
    const nuevoNumero = ultimoNumero + 1;
    return `${prefix}${String(nuevoNumero).padStart(3, '0')}`;
}

// Listar ventas
router.get('/', async (req, res) => {
    try {
        const userAgent = req.headers['user-agent'];
        let ventass;

        if (userAgent && userAgent.includes('Postman')) {
            ventass = await Vent.find({}, { _id: 0, cliente_id: 0, producto_id: 0, fecha: 0 });
        } else {
            ventass = await Vent.find();
        }

        res.json(ventass);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener productos');
    }
});

// Crear nueva venta
router.post('/', async (req, res) => {
    try {
        const { productos, tipo_documento } = req.body;

        // Generar el número de serie automáticamente
        const num_serie = await generarNumeroSerie(tipo_documento);

        // Validar stock antes de procesar la venta
        for (const item of productos) {
            const producto = await Producto.findById(item.producto_id);

            if (!producto) {
                return res.status(400).json({
                    error: `Producto con ID ${item.producto_id} no encontrado`,
                    productoId: item.producto_id
                });
            }

            if (producto.stock === 0) {
                return res.status(400).json({
                    error: `El producto "${producto.nombre}" está agotado (Stock: 0)`,
                    producto: producto.nombre,
                    stockDisponible: 0,
                    cantidadSolicitada: item.cantidad
                });
            }

            if (producto.stock < item.cantidad) {
                return res.status(400).json({
                    error: `Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stock}, Solicitado: ${item.cantidad}`,
                    producto: producto.nombre,
                    stockDisponible: producto.stock,
                    cantidadSolicitada: item.cantidad
                });
            }
        }

        // Agregar el número de serie al cuerpo antes de guardar
        const nuevaVenta = new Vent({ ...req.body, num_serie });

        await nuevaVenta.save();

        // Actualizar el stock de cada producto
        for (const item of productos) {
            await Producto.findByIdAndUpdate(
                item.producto_id,
                { $inc: { stock: -item.cantidad } },
                { new: true }
            );
        }

        res.status(201).json(nuevaVenta);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// PUT - Actualizar una Venta completa
router.put('/', async (req, res) => {
    try {
        const actualizado = await Vent.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, overwrite: true, runValidators: true }
        );
        res.status(200).json(actualizado);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// PATCH - Actualizar parcialmente una Venta
router.patch('/:id', async (req, res) => {
    try{
        const actualizado =  await Vent.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true}
        );
        res.status(200).json(actualizado);
    } catch(e){
        res.status(500).json({ error: e.message });
    }
});

// DELETE - Eliminar una Venta
router.delete('/:id', async (req, res) => {
    try{
        const eliminado = await Vent.findByIdAndDelete(req.params.id);
        res.status(200).json(eliminado);
    }catch(e){
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;