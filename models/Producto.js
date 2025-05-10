const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const productSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  categoria_id: {
    type: Types.ObjectId,
    ref: 'categorias',
    required: true
  },
  stock: {
    type: Number,
    default: 0
  },
  caracteristicas: {
    type: Schema.Types.Mixed,
    default: {}
  },
  imagen: {
    type: String, // URL o ruta local
    default: ''
  }
});

module.exports = mongoose.model('productos', productSchema);
