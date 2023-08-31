import { DataTypes } from "sequelize";
import database from "../services/DBConnection";
import Personal from "./personal";

const FotoPersonal = database.define("foto_personal", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  foto: {
    type: DataTypes.BLOB,
    allowNull: false,
  },
  id_personal: {
    type: DataTypes.INTEGER,
  },
});

FotoPersonal.belongsTo(Personal, { foreignKey: "id_personal" });

FotoPersonal.sync();

export default FotoPersonal;
