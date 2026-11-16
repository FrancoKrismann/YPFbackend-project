const { Contenido, Categoria, Genero, Actor } = require('../../models');

const incluir = [
  { model: Categoria, attributes: ['nombre'] },
  { model: Genero, attributes: ['nombre'], through: { attributes: [] } },
  { model: Actor, attributes: ['nombre'], through: { attributes: [] } },
];

// Función para aplanar y formatear el contenido (igual que en el GET)
function formatear(contenido) {
  const { Categoria, Generos, Actors, categoriaId, ...resto } = contenido.toJSON();

  return {
    ...resto,
    categoria: Categoria?.nombre ?? null,
    generos: Generos ? Generos.map((g) => g.nombre) : [],
    actores: Actors ? Actors.map((a) => a.nombre) : [],
  };
}

async function crearContenido(req, res) {
  try {
    const { titulo, categoria, generos, sinopsis, temporadas, reparto, trailer } = req.body;

    // 1. Buscar o crear la categoría si viene en el cuerpo de la petición
    let categoriaRecord = null;
    if (categoria) {
      [categoriaRecord] = await Categoria.findOrCreate({
        where: { nombre: categoria },
      });
    }

    // 2. Crear el registro principal en la tabla Contenido
    const nuevoContenido = await Contenido.create({
      titulo,
      sinopsis,
      temporadas,
      trailer,
      categoriaId: categoriaRecord ? categoriaRecord.id : null,
    });

    // 3. Asociar géneros (soporta tanto un array como un texto separado por comas)
    if (generos) {
      const listaGeneros = Array.isArray(generos)
        ? generos
        : generos.split(',').map((g) => g.trim());

      const generosRecords = await Promise.all(
        listaGeneros.map((nombre) => Genero.findOrCreate({ where: { nombre } }))
      );
      await nuevoContenido.setGeneros(generosRecords.map(([g]) => g));
    }

    // 4. Asociar actores / reparto (soporta array o texto separado por comas)
    if (reparto) {
      const listaActores = Array.isArray(reparto)
        ? reparto
        : reparto.split(',').map((a) => a.trim());

      const actoresRecords = await Promise.all(
        listaActores.map((nombre) => Actor.findOrCreate({ where: { nombre } }))
      );
      await nuevoContenido.setActors(actoresRecords.map(([a]) => a));
    }

    // 5. Volver a consultar el registro con todas sus relaciones y devolverlo formateado
    const contenidoCompleto = await Contenido.findByPk(nuevoContenido.id, { include: incluir });
    
    res.status(201).json(formatear(contenidoCompleto));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { crearContenido };