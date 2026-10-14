const asyncHandler = require('../../utils/asyncHandler');
const Pozo = require('../../models/pozo.model');

// Obtener todos los pozos (con filtro opcional por estado en query)
const obtenerPozos = asyncHandler(async (req, res) => {
  const { estado } = req.query;
  const filtro = {};

  if (estado) {
    // Insensible a mayúsculas/minúsculas
    filtro.estado = { $regex: new RegExp(`^${estado}$`, 'i') };
  }

  const resultado = await Pozo.find(filtro);
  res.status(200).json(resultado);
});

// Obtener un pozo por ID numérico o por _id
const obtenerPorId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let pozo = null;

  if (!isNaN(id)) {
    pozo = await Pozo.findOne({ id: Number(id) });
  } else if (id.match(/^[0-9a-fA-F]{24}$/)) {
    pozo = await Pozo.findById(id);
  }

  if (!pozo) {
    return res.status(404).json({ error: 'Pozo no encontrado' });
  }

  res.status(200).json(pozo);
});

// Obtener pozos por yacimiento (insensible a mayúsculas/minúsculas)
const obtenerPorYacimiento = asyncHandler(async (req, res) => {
  const { yacimiento } = req.params;

  const resultado = await Pozo.find({
    yacimiento: { $regex: new RegExp(`^${yacimiento}$`, 'i') }
  });

  if (resultado.length === 0) {
    return res.status(404).json({ error: `No se encontraron pozos para el yacimiento '${yacimiento}'` });
  }

  res.status(200).json(resultado);
});

module.exports = { obtenerPozos, obtenerPorId, obtenerPorYacimiento };