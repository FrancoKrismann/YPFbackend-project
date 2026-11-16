const { Contenido, Categoria, Genero, Actor } = require('../../models');

const incluir = [
  { model: Categoria, attributes: ['nombre'] },
  { model: Genero, attributes: ['nombre'], through: { attributes: [] } },
  { model: Actor, attributes: ['nombre'], through: { attributes: [] } },
];

function formatear(contenido) {
  const { Categoria, Generos, Actors, categoriaId, ...resto } = contenido.toJSON();

  return {
    ...resto,
    categoria: Categoria?.nombre ?? null,
    generos: Generos ? Generos.map((g) => g.nombre) : [],
    actores: Actors ? Actors.map((a) => a.nombre) : [],
  };
}

async function actualizarContenido(req, res) {
  try {
    const { id } = req.params;
    const { titulo, categoria, generos, sinopsis, temporadas, reparto, trailer } = req.body;

    const contenido = await Contenido.findByPk(id);
    if (!contenido) {
      return res.status(404).json({ error: 'Contenido no encontrado' });
    }

    // Actualizar categoría si se envía
    let categoriaId = contenido.categoriaId;
    if (categoria !== undefined) {
      const [categoriaRecord] = await Categoria.findOrCreate({
        where: { nombre: categoria },
      });
      categoriaId = categoriaRecord.id;
    }

    // Actualizar campos principales
    await contenido.update({
      titulo: titulo ?? contenido.titulo,
      sinopsis: sinopsis ?? contenido.sinopsis,
      temporadas: temporadas ?? contenido.temporadas,
      trailer: trailer ?? contenido.trailer,
      categoriaId,
    });

    // Actualizar géneros si se envían
    if (generos) {
      const listaGeneros = Array.isArray(generos)
        ? generos
        : generos.split(',').map((g) => g.trim());

      const generosRecords = await Promise.all(
        listaGeneros.map((nombre) => Genero.findOrCreate({ where: { nombre } }))
      );
      await contenido.setGeneros(generosRecords.map(([g]) => g));
    }

    // Actualizar reparto/actores si se envían
    if (reparto) {
      const listaActores = Array.isArray(reparto)
        ? reparto
        : reparto.split(',').map((a) => a.trim());

      const actoresRecords = await Promise.all(
        listaActores.map((nombre) => Actor.findOrCreate({ where: { nombre } }))
      );
      await contenido.setActors(actoresRecords.map(([a]) => a));
    }

    const contenidoActualizado = await Contenido.findByPk(id, { include: incluir });
    res.json(formatear(contenidoActualizado));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { actualizarContenido };