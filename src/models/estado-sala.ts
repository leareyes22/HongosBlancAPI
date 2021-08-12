import { DataTypes } from "sequelize";
import database from "../services/DBConnection";
import Sala from "./sala";

const EstadoSala = database.define("estado_sala", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

EstadoSala.hasMany(Sala, { foreignKey: "id_estado" });

EstadoSala.sync();

export default EstadoSala;
