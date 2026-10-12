const mongoose = require('mongoose');

const pozoSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    yacimiento: {
      type: String,
      required: [true, 'El yacimiento es obligatorio'],
      trim: true, 
    },
    estado: {
      type: String,
      enum: ['activo', 'inactivo', 'En Mantenimiento', 'Cerrado'],
    },
  },
  {
    timestamps: true, // createdAt y updatedAt automáticos
    versionKey: false,
  }
);

module.exports = mongoose.model('Pozo', pozoSchema);