import { DataTypes } from "sequelize";
import database from "../services/DBConnection";
import ControlSala from "./control-sala";
import Cosecha from "./cosecha";
import Tarea from "./tarea";

const Sala = database.define("sala", {
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
  id_estado: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Sala.hasMany(ControlSala, { foreignKey: "id_sala" });
Sala.hasMany(Cosecha, { foreignKey: "id_sala" });
Sala.hasMany(Tarea, { foreignKey: "id_sala" });

Sala.sync();

export default Sala;
