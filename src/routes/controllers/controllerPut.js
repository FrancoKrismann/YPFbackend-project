const asyncHandler = require('../../utils/asyncHandler');
const Pozo = require('../../models/pozo.model');

const actualizarPozo = asyncHandler(async (req, res) => {
  // El ID puede venir por URL params (:id) o por query (?id=...)
  const id = req.params.id 

  if (!id) {
    return res.status(400).json({ error: 'Debes proporcionar el id del pozo a actualizar' });
  }

  // Tomamos los datos a actualizar prioritariamente desde req.query (o req.body si no hay query)
  const datosActualizar = Object.keys(req.query).length > 0 ? { ...req.query } : { ...req.body };

  // Removemos el id de los campos a actualizar para no sobreescribir la clave
  delete datosActualizar.id;

  // Si enviaron estado, lo normalizamos
  if (datosActualizar.estado) {
    datosActualizar.estado = datosActualizar.estado.toLowerCase().trim();
  }

  // Convertimos campos numéricos si están presentes en la query
  if (datosActualizar.profundidadMetros) {
    datosActualizar.profundidadMetros = Number(datosActualizar.profundidadMetros);
  }
  if (datosActualizar.produccionDiariaBarriles) {
    datosActualizar.produccionDiariaBarriles = Number(datosActualizar.produccionDiariaBarriles);
  }

  // Buscamos y actualizamos directamente en MongoDB
  let pozoActualizado = null;

  if (!isNaN(id)) {
    pozoActualizado = await Pozo.findOneAndUpdate(
      { id: Number(id) },
      { $set: datosActualizar },
      { new: true, runValidators: true }
    );
  } else if (id.match(/^[0-9a-fA-F]{24}$/)) {
    pozoActualizado = await Pozo.findByIdAndUpdate(
      id,
      { $set: datosActualizar },
      { new: true, runValidators: true }
    );
  }

  if (!pozoActualizado) {
    return res.status(404).json({ error: 'Pozo no encontrado en la base de datos' });
  }

  res.status(200).json({
    mensaje: 'Pozo actualizado correctamente en la base de datos',
    data: pozoActualizado
  });
});

module.exports = { actualizarPozo };