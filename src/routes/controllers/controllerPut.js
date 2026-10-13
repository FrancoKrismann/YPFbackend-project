const { pozos } = require('../../../database/data');

const actualizarPozo = (req, res) => {
  const { id } = req.params;
  const pozo = pozos.find(p => p.id === Number(id));
  if (!pozo) return res.status(404).json({ error: 'Pozo no encontrado' });

  // Lógica de actualización
  Object.assign(pozo, req.body);
  res.json({ mensaje: 'Pozo actualizado', data: pozo });
};

module.exports = { actualizarPozo };