const { pozos } = require('../../../database/data');

const eliminarPozo = (req, res) => {
  const { id } = req.params;
  const index = pozos.findIndex(p => p.id === Number(id));
  if (index === -1) return res.status(404).json({ error: 'Pozo no encontrado' });

  pozos.splice(index, 1);
  res.json({ mensaje: 'Pozo eliminado correctamente' });
};

module.exports = { eliminarPozo };