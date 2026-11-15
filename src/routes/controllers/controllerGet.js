const { Contenido, Categoria, Genero, Actor } = require('../../models');

const incluir = [
  { model: Categoria, attributes: ['nombre'] },
  { model: Genero, attributes: ['nombre'], through: { attributes: [] } },
  { model: Actor, attributes: ['nombre'], through: { attributes: [] } },
];

// Aplana un contenido: categoria como texto, generos y actores como arrays de strings
function formatear(contenido) {
  const { Categoria, Generos, Actors, categoriaId, ...resto } = contenido.toJSON();

  return {
    ...resto,
    categoria: Categoria?.nombre ?? null,
    generos: Generos.map((g) => g.nombre),
    actores: Actors.map((a) => a.nombre),
  };
}

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
    res.json(contenido);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { obtenerContenidos, obtenerContenidoPorId };