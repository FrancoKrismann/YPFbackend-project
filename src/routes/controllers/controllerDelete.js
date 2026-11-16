const { Contenido } = require('../../models');

async function eliminarContenido(req, res) {
  try {
    const { id } = req.params;

    // Validar que el ID sea numérico
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'El ID proporcionado no es válido' });
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

    res.json({ mensaje: 'Contenido eliminado correctamente', id: Number(id) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { eliminarContenido };