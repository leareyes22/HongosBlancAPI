import { DataTypes } from "sequelize";
import database from "../services/DBConnection";
import ControlSala from './control-sala';

const Temperatura = database.define("temperatura", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
  },
  id_control: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  nro_cama: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  t1: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  t2: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  t3: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  t4: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  t5: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  t6: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

Temperatura.hasOne(ControlSala, { foreignKey: "id" });

Temperatura.sync();

export default Temperatura;