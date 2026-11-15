const { Categoria, Genero, Actor, Contenido } = require('./models');
const catalogo = require('../database/data.json');

const separar = (txt) => txt.split(',').map((s) => s.trim()).filter(Boolean);

async function seed() {
  // Si ya hay datos, no vuelve a cargar
  const cantidad = await Contenido.count();
  if (cantidad > 0) {
    console.log('Catálogo ya cargado');
    return;
  }

  for (const item of catalogo) {
    const [categoria] = await Categoria.findOrCreate({ where: { nombre: item.categoria } });

    const contenido = await Contenido.create({
      id: item.id,
      titulo: item.titulo,
      sinopsis: item.sinopsis,
      temporadas: Number.isInteger(item.temporadas) ? item.temporadas : null,
      trailer: item.trailer || null,
      categoriaId: categoria.id,
    });

    const generos = [];
    for (const nombre of separar(item.genero)) {
      const [g] = await Genero.findOrCreate({ where: { nombre } });
      generos.push(g);
    }
    await contenido.setGeneros(generos);

    const actores = [];
    for (const nombre of separar(item.reparto)) {
      const [a] = await Actor.findOrCreate({ where: { nombre } });
      actores.push(a);
    }
    await contenido.setActors(actores);
  }

  console.log('Catálogo cargado');
}

module.exports = seed;