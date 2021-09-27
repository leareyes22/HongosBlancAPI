import { validationResult } from "express-validator";
import sequelize from "../services/DBConnection";
import express from "express";
import _ from "lodash";
import Cosecha from "../models/cosecha";
import { BadRequest, Internal } from "../errors/error";
import CreateCosechaDTO from "../dtos/cosecha-dto";
import CosechaDTO from "../dtos/cosecha-dto";

export const createCosecha = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  console.log(req.query);
  const errors = validationResult(req);
  console.log(errors);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const cosecha: any = await Cosecha.create({
      fecha_cosechada: req.body.fecha_cosechada,
      id_producto: req.body.id_producto,
      kg_cosechados: req.body.kg_cosechados,
      observaciones: req.body.observaciones,
      id_sala: req.body.id_sala,
      id_personal: req.body.id_personal,
      id_turno: req.body.id_turno,
    } as CreateCosechaDTO);

    if (!_.isNull(cosecha)) {
      res.json({ id_cosecha: cosecha.id });
    } else {
      throw new BadRequest(
        "Solicitud errónea.",
        Error("Por favor ingrese datos válidos.")
      );
    }
  } catch (e) {
    next(e);
  }
};

export const cosechas = function (req: any, res: any) {
  console.log(req.query);

  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  return sequelize
    .query(
      "SELECT cosecha.id, cosecha.fecha_cosechada, producto.nombre as producto, cosecha.kg_cosechados, \
          cosecha.observaciones, sala.nombre as sala, personal.username as personal, turno.nombre as turno\
          FROM cosecha, sala, personal, turno, producto \
          WHERE cosecha.id_sala = sala.id AND cosecha.id_turno = turno.id AND cosecha.id_personal = personal.id AND cosecha.id_producto = producto.id \
          ORDER BY cosecha.fecha_cosechada",
      {
        type: "SELECT",
      }
    )
    .then((data: any) => {
      res.status(200).send(
        JSON.stringify(
          data.map(
            (cosecha: any) =>
              ({
                id: cosecha.id,
                fecha_cosechada: cosecha.fecha_cosechada,
                producto: cosecha.producto,
                kg_cosechados: cosecha.kg_cosechados,
                observaciones: cosecha.observaciones,
                sala: cosecha.sala,
                personal: cosecha.personal,
                turno: cosecha.turno,
              } as CosechaDTO)
          )
        )
      );
    })
    .catch((error) => {
      res.status(400).send(error);
    });
};
