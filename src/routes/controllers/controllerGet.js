const { Contenido, Categoria, Genero, Actor } = require('../../models');
const { incluir, formatear } = require('../../utils/asyncHandler');


async function obtenerContenidos(req, res) {
  try {
    const contenidos = await Contenido.findAll({ include: incluir });
    res.json(contenidos.map(formatear));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function obtenerContenidoPorId(req, res) {
  try {
    const contenido = await Contenido.findByPk(req.params.id, { include: incluir });
    if (!contenido) return res.status(404).json({ error: 'No encontrado' });
    res.json(formatear(contenido));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}



module.exports = { obtenerContenidos, obtenerContenidoPorId };