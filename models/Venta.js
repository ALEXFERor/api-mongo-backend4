const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const productoSchema = new Schema({
    producto_id: {
        type: Types.ObjectId,
        ref: 'Producto',
        required: true
    },
    cantidad: {
        type: Number,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    }
}, { _id: false });

const ventaSchema = new Schema({
    cliente_id: {
        type: Types.ObjectId,
        ref: 'Cliente',
        required: true
    },
    tipo_documento: {
        type: String,
        enum: ['factura', 'boleta'],
        required: true
    },
    num_serie: {
        type: String,
        required: true
    },
    productos: {
        type: [productoSchema],
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    metodo_pago: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: { createdAt: 'fecha', updatedAt: false }
});

module.exports = mongoose.model('Venta', ventaSchema);
