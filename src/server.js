require('dotenv').config();
const app = require('./app');
const { sequelize } = require('../database/sql.js');
const seed = require('./seed');


const PORT = process.env.SERVER_PORT;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado a MySQL');

    await sequelize.sync({ force: true });  // crea las tablas si no existen
    await seed();             // carga el catálogo solo si está vacío

    app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
  }
})();