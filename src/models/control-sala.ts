import { DataTypes } from "sequelize";
import database from "../services/DBConnection";
import FotoControl from "./foto-control";

const ControlSala = database.define("control_sala", {
  id: {
    type: DataTypes.BIGINT,
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
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  id_personal: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  id_turno: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  id_foto: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

ControlSala.belongsTo(FotoControl, { foreignKey: "id_foto" });

ControlSala.sync();

export default ControlSala;
