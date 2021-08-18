import { DataTypes } from "sequelize";
import database from "../services/DBConnection";
import FotoControl from "./foto-control";

const ControlSala = database.define("control_sala", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fecha_control: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  temperatura_aire: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  humedad_relativa: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  co2: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  observaciones: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  id_sala: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_personal: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_turno: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_foto: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

ControlSala.belongsTo(FotoControl, { foreignKey: "id_foto" });

ControlSala.sync();

export default ControlSala;
