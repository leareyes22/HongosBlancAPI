import { DataTypes } from "sequelize";
import database from "../services/DBConnection";

const Tarea = database.define("tarea", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
  },
  fecha_generada: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  realizada: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  fecha_planificada: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  id_sala: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  id_personal: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

Tarea.sync();

export default Tarea;
