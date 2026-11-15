const { DataTypes } = require('sequelize');
const {sequelize} = require('../../database/sql.js'); 

const Categoria = sequelize.define('Categoria', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true },
}, { tableName: 'categorias', timestamps: false });

module.exports = Categoria;