import express from "express";
import _ from "lodash";
import TurnoDTO from "../dtos/turno-dto";
import Turno from "../models/turno";

export const turnos = function (req: any, res: any) {
  return Turno.findAll()
    .then((turnos) => {
      res.status(200).send(
        JSON.stringify(
          turnos.map(
            (turno: any) =>
              ({
                id: turno.id,
                nombre: turno.nombre,
                descripcion: turno.descripcion,
              } as TurnoDTO)
          )
        )
      );
    })
    .catch((error) => {
      res.status(400).send(error);
    });
};

export const turno = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    console.log(req.params.id);
    const turno: any = await Turno.findOne({
      where: { id: req.params.id },
    });
    if (!_.isNull(turno)) {
      const turnoResponse = {
        id: turno.id,
        nombre: turno.nombre,
        descripcion: turno.descripcion,
      } as TurnoDTO;
      res.json(turnoResponse);
    }
  } catch (e) {
    next(e);
  }
};
