const { DataTypes } = require('sequelize');
const {sequelize} = require('../../database/sql.js'); 

const Actor = sequelize.define('Actor', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(120), allowNull: false, unique: true },
}, { tableName: 'actores', timestamps: false });

module.exports = Actor;