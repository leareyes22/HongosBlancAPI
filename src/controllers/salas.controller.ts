import { validationResult } from "express-validator";
import sequelize from "../services/DBConnection";
import SalaDTO from "../dtos/sala-dto";
import express from "express";
import Sala from "../models/sala";
import _ from "lodash";
import EstadoSala from "../models/estado-sala";

export const salas = function (req: any, res: any) {
  console.log(req.query);

  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  return sequelize
    .query(
      "SELECT sala.id, sala.nombre as nombre, estado_sala.nombre as estado \
          FROM sala INNER JOIN estado_sala ON sala.id_estado=estado_sala.id \
          ORDER BY sala.id",
      {
        type: "SELECT",
      }
    )
    .then((data: any) => {
      res.status(200).send(
        JSON.stringify(
          data.map((sala: SalaDTO) => ({
            id: sala.id,
            nombre: sala.nombre,
            estado: sala.estado,
          }))
        )
      );
    })
    .catch((error) => {
      res.status(400).send(error);
    });
};

export const sala = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    console.log(req.params.id);
    const sala: any = await Sala.findOne({
      where: { id: req.params.id },
    });
    if (!_.isNull(sala)) {
      const estado_sala: any = await EstadoSala.findOne({
        where: { id: sala.id_estado },
      });
      if (!_.isNull(estado_sala)) {
        const salaResponse = {
          id: sala.id,
          nombre: sala.nombre,
          estado: estado_sala.nombre,
        } as SalaDTO;
        res.json(salaResponse);
      }
    }
  } catch (e) {
    next(e);
  }
};
