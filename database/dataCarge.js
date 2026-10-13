const { getDB } = require('./mongodb');
const { pozos } = require('./data');

async function seedPozos() {
  const collection = getDB().collection('pozos');
  const cantidad = await collection.countDocuments();

  if (cantidad === 0) {
    await collection.insertMany(pozos);
    console.log('Pozos cargados por primera vez');
  } else {
    console.log('La colección ya tiene datos, no se carga nada');
  }
}

module.exports = { seedPozos };