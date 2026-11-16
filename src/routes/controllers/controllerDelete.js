const { Op } = require('sequelize');
const { Contenido } = require('../../models');

async function eliminarContenidoPorTitulo(req, res) {
  try {
    const rawTitulo =
      req.params.titulo ||
      req.params.id ||
      req.query.titulo ||
      req.query.nombre ||
      req.body?.titulo ||
      req.body?.nombre;

    if (!rawTitulo || typeof rawTitulo !== 'string' || !rawTitulo.trim()) {
      return res.status(400).json({
        error: 'Debes proporcionar un título válido (por URL /titulo/:titulo, query ?titulo=... o en el body)',
      });
    }

    const titulo = rawTitulo.trim();

    // 1. Intentamos coincidencia exacta primero
    let contenido = await Contenido.findOne({
      where: { titulo },
    });

    // 2. Si no se encuentra exacto, buscamos con LIKE (coincidencia parcial o insensible a mayúsculas/minúsculas)
    if (!contenido) {
      contenido = await Contenido.findOne({
        where: {
          titulo: { [Op.like]: `%${titulo}%` },
        },
      });
    }

    if (!contenido) {
      return res.status(404).json({
        error: `No se encontró ningún contenido con el título "${titulo}"`,
      });
    }

    // 1. Desvincular géneros y actores para evitar restricciones de clave foránea
    await contenido.setGeneros([]);
    await contenido.setActors([]);

    // 2. Eliminar el contenido
    await contenido.destroy();

    return res.json({
      mensaje: 'Contenido eliminado correctamente',
      id: contenido.id,
      titulo: contenido.titulo,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}

async function eliminarContenido(req, res) {
  try {
    const { id } = req.params;
    const queryTitulo = req.query?.titulo || req.query?.nombre;
    const bodyTitulo = req.body?.titulo || req.body?.nombre;

    // Si viene título por query o body, o no se mandó un id en los params
    if (!id || queryTitulo || bodyTitulo) {
      return eliminarContenidoPorTitulo(req, res);
    }

    // Si el ID recibido no es un número (ej: /contenido/Riverdale), lo interpretamos como título
    if (isNaN(id)) {
      req.params.titulo = id;
      return eliminarContenidoPorTitulo(req, res);
    }

    const contenido = await Contenido.findByPk(id);

    if (!contenido) {
      return res.status(404).json({ error: 'Contenido no encontrado' });
    }

    // 1. Desvincular géneros y actores para evitar restricciones de clave foránea
    await contenido.setGeneros([]);
    await contenido.setActors([]);

    // 2. Eliminar el contenido
    await contenido.destroy();

    return res.json({
      mensaje: 'Contenido eliminado correctamente',
      id: Number(id),
      titulo: contenido.titulo,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = { eliminarContenido, eliminarContenidoPorTitulo };
