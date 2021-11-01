import express from "express";
import sequelize from "../services/DBConnection";
import { validationResult } from "express-validator";
import RolDTO from "../dtos/rol-dto";
import Rol from "../models/rol";
import _ from "lodash";
import { NotFound } from "../errors/error";

export const roles = function (req: any, res: any) {
  console.log(req.query);

  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  return sequelize
    .query(
      "SELECT rol.id, rol.nombre as nombre, rol.descripcion as descripcion \
            FROM rol \
            ORDER BY rol.id",
      {
        type: "SELECT",
      }
    )
    .then((data: any) => {
      res.status(200).send(
        JSON.stringify(
          data.map((rol: RolDTO) => ({
            id: rol.id,
            nombre: rol.nombre,
            descripcion: rol.descripcion,
          }))
        )
      );
    })
    .catch((error) => {
      res.status(400).send(error);
    });
};

export const rol = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const rol: any = await Rol.findOne({
      where: { id: req.params.id },
    });
    if (!_.isNull(rol)) {
      const rolResponse = {
        id: rol.id,
        nombre: rol.nombre,
        descripcion: rol.descripcion,
      } as RolDTO;
      res.json(rolResponse);
    } else {
      throw new NotFound(
        "Solicitud inválida.",
        Error("No se encuentra el rol requerido.")
      );
    }
  } catch (e) {
    next(e);
  }
};
