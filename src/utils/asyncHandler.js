const { Contenido, Categoria, Genero, Actor } = require('../models');
// Evita repetir try/catch en cada controlador
module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const incluir = [
  { model: Categoria, as: 'categoria', attributes: ['nombre'] },
  { model: Genero, attributes: ['nombre'], through: { attributes: [] } },
  { model: Actor, attributes: ['nombre'], through: { attributes: [] } },
];

// Función para aplanar y formatear el contenido (igual que en el GET)
function formatear(contenido) {
  const plano = contenido.toJSON();
  const { categoria, Generos, Actors, ...resto } = plano;

  return {
    ...resto,
    categoria: categoria?.nombre ?? null,
    generos: (Generos ?? []).map((g) => g.nombre),
    actores: (Actors ?? []).map((a) => a.nombre),
  };
}
module.exports = { incluir, formatear };