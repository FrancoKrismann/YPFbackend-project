const { Op } = require('sequelize');
const { Contenido, Categoria, Genero, Actor } = require('../../models');
const { incluir, formatear } = require('../../utils/asyncHandler');

// Obtener todos los contenidos o filtrar por query params: ?titulo=...&categoria=...&genero=...&actor=...
async function obtenerContenidos(req, res) {
  try {
    const id = req.query.id;
    const titulo = req.query.titulo || req.params.titulo;
    const categoria = req.query.categoria || req.params.categoria;
    const genero = req.query.genero || req.params.genero;
    const actor = req.query.actor || req.query.reparto || req.params.actor;

    // 1. Filtros para la tabla principal Contenido
    const whereContenido = {};

    if (id && !isNaN(id)) {
      whereContenido.id = Number(id);
    }

    if (titulo && typeof titulo === 'string' && titulo.trim()) {
      whereContenido.titulo = { [Op.like]: `%${titulo.trim()}%` };
    }

    // 2. Includes dinámicos con filtros opcionales
    const includeFiltros = [
      {
        model: Categoria,
        as: 'categoria',
        attributes: ['nombre'],
        ...(categoria && typeof categoria === 'string' && categoria.trim()
          ? { where: { nombre: { [Op.like]: `%${categoria.trim()}%` } }, required: true }
          : {}),
      },
      {
        model: Genero,
        attributes: ['nombre'],
        through: { attributes: [] },
        ...(genero && typeof genero === 'string' && genero.trim()
          ? { where: { nombre: { [Op.like]: `%${genero.trim()}%` } }, required: true }
          : {}),
      },
      {
        model: Actor,
        attributes: ['nombre'],
        through: { attributes: [] },
        ...(actor && typeof actor === 'string' && actor.trim()
          ? { where: { nombre: { [Op.like]: `%${actor.trim()}%` } }, required: true }
          : {}),
      },
    ];

    const contenidos = await Contenido.findAll({
      where: whereContenido,
      include: includeFiltros,
    });

    // Si se filtró por género o actor, recargamos con todas sus relaciones
    // para que la respuesta muestre la lista completa de géneros y actores del contenido
    if ((genero || actor) && contenidos.length > 0) {
      const ids = contenidos.map((c) => c.id);
      const contenidosCompletos = await Contenido.findAll({
        where: { id: ids },
        include: incluir,
      });
      return res.json(contenidosCompletos.map(formatear));
    }

    res.json(contenidos.map(formatear));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

// Buscar por ID numérico o por título directamente en la URL: /contenido/:id
async function obtenerContenidoPorId(req, res) {
  try {
    const { id } = req.params;

    if (!id || typeof id !== 'string' || !id.trim()) {
      return res.status(400).json({ error: 'Debes proporcionar un ID o título' });
    }

    // 1. Si es numérico, buscamos por ID
    if (!isNaN(id)) {
      const contenido = await Contenido.findByPk(Number(id), { include: incluir });
      if (!contenido) {
        return res.status(404).json({ error: `Contenido con ID ${id} no encontrado` });
      }
      return res.json(formatear(contenido));
    }

    // 2. Si no es numérico, buscamos por título (primero exacto y luego parcial con LIKE)
    const tituloBuscado = id.trim();
    let contenido = await Contenido.findOne({
      where: { titulo: tituloBuscado },
      include: incluir,
    });

    if (!contenido) {
      contenido = await Contenido.findOne({
        where: { titulo: { [Op.like]: `%${tituloBuscado}%` } },
        include: incluir,
      });
    }

    if (!contenido) {
      return res.status(404).json({
        error: `No se encontró ningún contenido con el ID o título "${id}"`,
      });
    }

    return res.json(formatear(contenido));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { obtenerContenidos, obtenerContenidoPorId };
