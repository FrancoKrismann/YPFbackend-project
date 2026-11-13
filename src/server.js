require('dotenv').config();
const app = require('./app');
const PORT = process.env.SERVER_PORT;
const {pool} = require('../database/sql.js'); 



(async () => {
  try {
    await pool.query('SELECT 1');
    
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
    console.log('Conexión a MySQL OK');
  } catch (err) {
    console.error('Error de conexión:', err.message);
  }
})();;
