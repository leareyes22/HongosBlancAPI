import { DataTypes } from "sequelize";
import database from "../services/DBConnection";

const Tarea = database.define("tarea", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
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
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_personal_asignado: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_personal_creador: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Tarea.sync();

export default Tarea;
