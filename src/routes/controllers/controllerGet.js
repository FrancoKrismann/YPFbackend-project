const { pozos } = require("../../../database/data")

const obtenerPozos = (req, res) => {
  const { estado } = req.query;
  const resultado = estado ? pozos.filter(p => p.estado === estado) : pozos;
  res.json(resultado);
};

const obtenerPorId = (req, res) => {
  const pozo = pozos.find(p => p.id === Number(req.params.id));
  if (!pozo) return res.status(404).json({ error: 'Pozo no encontrado' });
  res.json(pozo);
};

const obtenerPorYacimiento = (req, res) => {
  const resultado = pozos.filter(
    p => p.yacimiento.toLowerCase() === req.params.yacimiento.toLowerCase()
  );
  res.json(resultado);
};

module.exports = { obtenerPozos, obtenerPorId, obtenerPorYacimiento };