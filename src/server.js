require('dotenv').config();
const app = require('./app');
const PORT = process.env.PORT;
const {connectDB} = require('../database/mongodb'); 
const { seedPozos } = require('../database/datacarge'); 



connectDB()
  .then(seedPozos)
  .then(() => {
    app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
  })
  .catch((err) => {
    console.error('Error al iniciar:', err.message);
    process.exit(1);
  });
