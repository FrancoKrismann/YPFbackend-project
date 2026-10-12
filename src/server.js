const result = require('dotenv').config();
const app = require('./app');
const PORT = process.env.PORT || 3008;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
