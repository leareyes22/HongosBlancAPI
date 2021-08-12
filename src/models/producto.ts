import { DataTypes } from "sequelize";
import database from "../services/DBConnection";
import Cosecha from "./cosecha";

const Producto = database.define("producto", {
  id: {
    type: DataTypes.BIGINT,
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

Producto.hasMany(Cosecha, { foreignKey: "id_producto" });

Producto.sync();

export default Producto;
