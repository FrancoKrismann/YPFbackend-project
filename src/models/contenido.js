const { DataTypes } = require('sequelize');
const {sequelize} = require('../../database/sql.js'); 

const Contenido = sequelize.define('Contenido', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titulo: { type: DataTypes.STRING(150), allowNull: false },
  sinopsis: { type: DataTypes.TEXT, allowNull: false },
  temporadas: { type: DataTypes.INTEGER, allowNull: true }, // NULL para películas
  trailer: { type: DataTypes.STRING(255), allowNull: true }, // algunos no tienen
}, { tableName: 'contenidos', timestamps: false });

module.exports = Contenido;