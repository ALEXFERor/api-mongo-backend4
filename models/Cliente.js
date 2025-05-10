const mongoose = require("mongoose");
const { Schema } = mongoose;

// Definir el esquema de Cliente
const clienteSchema = new Schema({

    nombre: {
        type: String,
        required: true
    },
    tipo_documento: {
        type: String,
        enum: ['ruc', 'dni'],
        required: true
    },
    documento: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("cliente", clienteSchema);
