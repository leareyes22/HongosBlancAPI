import { DataTypes } from "sequelize";
import database from "../services/DBConnection";
import Turno from "./turno";

const Cosecha = database.define("cosecha", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fecha_cosechada: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  kg_cosechados: {
    type: DataTypes.FLOAT,
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
});

Cosecha.sync();

export default Cosecha;
