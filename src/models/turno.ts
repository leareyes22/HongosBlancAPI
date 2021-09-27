import { DataTypes } from "sequelize";
import database from "../services/DBConnection";
import ControlSala from "./control-sala";
import Cosecha from "./cosecha";

const Turno = database.define("turno", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Turno.hasMany(ControlSala, { foreignKey: "id_turno" });
Turno.hasMany(Cosecha, { foreignKey: "id_turno" });

Turno.sync();

export default Turno;
