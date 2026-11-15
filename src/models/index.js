const sequelize = require('../../database/sql.js'); 
const Categoria = require('./categoria');
const Genero = require('./genero');
const Actor = require('./actor');
const Contenido = require('./contenido');

// 1:N
Categoria.hasMany(Contenido, { foreignKey: { name: 'categoriaId', allowNull: false } });
Contenido.belongsTo(Categoria, { foreignKey: 'categoriaId' });

// N:M
Contenido.belongsToMany(Genero, { through: 'contenido_genero', foreignKey: 'contenidoId', otherKey: 'generoId', timestamps: false });
Genero.belongsToMany(Contenido, { through: 'contenido_genero', foreignKey: 'generoId', otherKey: 'contenidoId', timestamps: false });

Contenido.belongsToMany(Actor, { through: 'contenido_actor', foreignKey: 'contenidoId', otherKey: 'actorId', timestamps: false });
Actor.belongsToMany(Contenido, { through: 'contenido_actor', foreignKey: 'actorId', otherKey: 'contenidoId', timestamps: false });

module.exports = { sequelize, Categoria, Genero, Actor, Contenido };