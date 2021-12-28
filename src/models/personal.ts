import { DataTypes } from "sequelize";
import database from "../services/DBConnection";
import ControlSala from "./control-sala";
import Cosecha from "./cosecha";
import Tarea from "./tarea";

const Personal = database.define("personal", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
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
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  id_rol: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Personal.hasMany(ControlSala, { foreignKey: "id_personal" });
Personal.hasMany(Cosecha, { foreignKey: "id_personal" });
Personal.hasMany(Tarea, { foreignKey: "id_personal_asignado" });
Personal.hasMany(Tarea, { foreignKey: "id_personal_creador" });

Personal.sync();

export default Personal;
