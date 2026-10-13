const asyncHandler = require('../../utils/asyncHandler');
const Pozo = require('../../models/pozo.model'); // Importamos el modelo de Mongoose

const crearPozo = asyncHandler(async (req, res) => {
  // Soporta tanto Query Parameters como Body JSON
  const datos = Object.keys(req.query).length > 0 ? req.query : req.body;
  const { id, nombre, Nombre, yacimiento, estado, icono, profundidadMetros, produccionDiariaBarriles } = datos;

  const nombrePozo = nombre || Nombre;

  // Validación de campos requeridos mínimos
  if (!id || !nombrePozo) {
    return res.status(400).json({ 
      error: 'Parámetros incompletos. Debes enviar al menos id y nombre.' 
    });
  }

  // Validación de estado: solo se permite 'activo', 'inactivo', 'mantenimiento' o 'cerrado'
  const estadosValidos = ['activo', 'inactivo', 'mantenimiento', 'cerrado'];
  const estadoFinal = estado ? estado.toLowerCase().trim() : 'activo';

  if (!estadosValidos.includes(estadoFinal)) {
    return res.status(400).json({
      error: `El estado '${estado}' no es válido. Debe ser uno de: ${estadosValidos.join(', ')}`
    });
  }

  // Creamos el nuevo documento con Mongoose
  // Si no se envía yacimiento, por defecto es 'Sierra Chata'
  const nuevoPozo = new Pozo({
    id: Number(id),
    nombre: nombrePozo,
    yacimiento: yacimiento || 'Sierra Chata',
    estado: estadoFinal,
    icono: icono || '🛢️',
    profundidadMetros: profundidadMetros ? Number(profundidadMetros) : 0,
    produccionDiariaBarriles: produccionDiariaBarriles ? Number(produccionDiariaBarriles) : 0
  });

  // Guardamos en la base de datos de MongoDB
  const pozoGuardado = await nuevoPozo.save();

  // Respondemos con código 201 (Created)
  res.status(201).json({
    mensaje: "Pozo creado exitosamente",
    pozo: pozoGuardado
  });
});

module.exports = { crearPozo };