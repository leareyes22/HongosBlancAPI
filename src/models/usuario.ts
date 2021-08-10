import { DataTypes } from "sequelize";
import database from "../services/DBConnection";
import Rol from "./rol";

const Personal = database.define("personal", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  id_rol: {
    type: DataTypes.BIGINT,
    allowNull: false,
  }
});

Personal.hasOne(Rol, { foreignKey: "id_rol" });

Personal.sync();

export default Personal;
