const asyncHandler = require('../../utils/asyncHandler');
const Pozo = require('../../models/pozo.model');

const eliminarPozo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Busca y elimina por id numérico o por _id de MongoDB
  let pozoEliminado = null;

  if (!isNaN(id)) {
    pozoEliminado = await Pozo.findOneAndDelete({ id: Number(id) });
  } 

  if (!pozoEliminado) {
    return res.status(404).json({ error: 'Pozo no encontrado' });
  }

  res.status(200).json({ 
    mensaje: 'Pozo eliminado correctamente de la base de datos', 
    data: pozoEliminado 
  });
});

module.exports = { eliminarPozo };