import { DataTypes } from "sequelize";
import database from "../services/DBConnection";
import ControlSala from "./control-sala";

const FotoControl = database.define("foto_control", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  foto: {
    type: DataTypes.BLOB,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  id_control: {
    type: DataTypes.INTEGER,
  },
});

FotoControl.belongsTo(ControlSala, { foreignKey: "id_control" });

FotoControl.sync();

export default FotoControl;
