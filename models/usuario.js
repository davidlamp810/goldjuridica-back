const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcrypt");
const Rol = require("./rol");

const Usuario = sequelize.define(
  "Usuario",
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rolId: { // Foreign key
      type: DataTypes.INTEGER,
      references: {
        model: Rol,
        key: 'id',
      },
    },
  },
  {
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.password) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      },
    },
    timestamps: false,
    tableName: 'usuarios'
  }
);

// Establecer la relación
Usuario.belongsTo(Rol, { foreignKey: 'rolId' });

module.exports = Usuario;
