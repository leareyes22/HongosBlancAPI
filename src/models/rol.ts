import { DataTypes } from "sequelize";
import database from "../services/DBConnection";

const Rol = database.define("rol", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Rol.sync();

export default Rol;