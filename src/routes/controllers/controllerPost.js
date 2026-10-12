const { pozos } = require('../../../database/data'); // O tu conexión a base de datos

const crearPozo = (req, res) => {
  const nuevoPozo = req.body;
  // Lógica para agregar el pozo
  pozos.push(nuevoPozo);
  res.status(201).json({ mensaje: 'Pozo creado con éxito', data: nuevoPozo });
};

module.exports = { crearPozo };