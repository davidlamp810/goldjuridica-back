const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Rol = require("./rol");
const Producto = require("./producto");

const Favorito = sequelize.define("Favorito", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  rolId: {  // Cambié 'usuario_id' por 'rolId'
    type: DataTypes.INTEGER,
    references: {
      model: Rol,
      key: 'Id',
    },
  },
  producto_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Producto,
      key: 'id',
    },
  },
}, {
  timestamps: false,
  tableName: 'favoritos'
});

// Establecer las relaciones
Rol.belongsToMany(Producto, { through: Favorito, foreignKey: 'rolId', as: 'favoritos' });  // Cambié 'usuario_id' por 'rolId'
Producto.belongsToMany(Rol, { through: Favorito, foreignKey: 'producto_id', as: 'rolesFavoritos' });  // Cambié 'usuariosFavoritos' por 'rolesFavoritos'

module.exports = Favorito;
