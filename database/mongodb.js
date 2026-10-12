const { MongoClient } = require('mongodb');
const DB_USERNAME = process.env.DB_USER;
const DBPASSWORD = process.env.DB_PASSWORD;


const client = new MongoClient(`mongodb+srv://${DB_USERNAME}:${DBPASSWORD}@ypftest.hu7stc7.mongodb.net/?appName=YPFtest`);

async function connectDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

// Call this only when your application terminates
async function disconnectDB() {
  await client.close();
}
function getDB() {
  return client.db('mi_base'); // el nombre de tu base
}


module.exports = { connectDB, disconnectDB, getDB };