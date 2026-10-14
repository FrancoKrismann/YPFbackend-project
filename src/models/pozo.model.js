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
      default: 'Sierra Chata',
      trim: true, 
    },
    estado: {
      type: String,
      enum: {
        values: ['activo', 'inactivo', 'mantenimiento', 'cerrado'],
        message: '{VALUE} no es un estado válido. Debe ser: activo, inactivo, mantenimiento o cerrado'
      },
      lowercase: true,
      default: 'activo',
    },
  },
  {
    timestamps: true, // createdAt y updatedAt automáticos
    versionKey: false,
  }
);

module.exports = mongoose.model('Pozo', pozoSchema, 'pozos');