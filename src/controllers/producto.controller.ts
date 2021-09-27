import { validationResult } from "express-validator";
import sequelize from "../services/DBConnection";
import express from "express";
import _ from "lodash";
import ProductoDTO from "../dtos/producto-dto";
import Producto from "../models/producto";
import { NotFound } from "../errors/error";

export const productos = function (req: any, res: any) {
  console.log(req.query);

  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  return sequelize
    .query(
      "SELECT producto.id, producto.nombre as nombre, producto.descripcion as descripcion \
          FROM producto \
          ORDER BY producto.id",
      {
        type: "SELECT",
      }
    )
    .then((data: any) => {
      res.status(200).send(
        JSON.stringify(
          data.map((producto: ProductoDTO) => ({
            id: producto.id,
            nombre: producto.nombre,
            descripcion: producto.descripcion,
          }))
        )
      );
    })
    .catch((error) => {
      res.status(400).send(error);
    });
};

export const producto = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const producto: any = await Producto.findOne({
      where: { id: req.params.id },
    });
    if (!_.isNull(producto)) {
      const productoResponse = {
        id: producto.id,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
      } as ProductoDTO;
      res.json(productoResponse);
    } else {
      throw new NotFound(
        "Solicitud inválida.",
        Error("No se encuentra el producto requerida.")
      );
    }
  } catch (e) {
    next(e);
  }
};
