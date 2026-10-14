const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ypftest.hu7stc7.mongodb.net/test?retryWrites=true&w=majority&appName=YPFtest`;
    
    // Conectamos usando Mongoose
    await mongoose.connect(uri, {
      family: 4,
      tlsAllowInvalidCertificates: true
    });

    console.log("Conectado con Mongoose exitosamente a MongoDB Atlas!");
    return mongoose.connection;
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error.message);
    throw error;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("Desconectado de MongoDB");
  } catch (error) {
    console.error("Error al desconectar:", error.message);
  }
};

function getDB() {
  return mongoose.connection.db;
}

module.exports = { connectDB, disconnectDB, getDB };