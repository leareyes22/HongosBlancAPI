import { DataTypes } from "sequelize";
import database from "../services/DBConnection";
import Personal from "./personal";

const Rol = database.define("rol", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
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

Rol.hasMany(Personal, { foreignKey: "id_rol" });

Rol.sync();

export default Rol;
