import { validationResult } from "express-validator";
import sequelize from "../services/DBConnection";
import express from "express";
import _ from "lodash";
import ControlSala from "../models/control-sala";
import Temperatura from "../models/temperatura";
import { BadRequest, NotFound } from "../errors/error";
import TemperaturaCamaDTO from "../dtos/temperatura-cama-dto";
import FotoControl from "../models/foto-control";
import { ControlDTO } from "../dtos/control-dto";

export const createControl = async function (
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
    const control: any = await ControlSala.create({
      fecha_control: req.body.fecha_control,
      temperatura_aire: req.body.temperatura_aire,
      humedad_relativa: req.body.humedad_relativa,
      co2: req.body.co2,
      observaciones: req.body.observaciones,
      id_sala: req.body.id_sala,
      id_personal: req.body.id_personal,
      id_turno: req.body.id_turno,
    });

    if (!_.isNull(control)) {
      req.body.temperaturas.forEach(async (temperatura: TemperaturaCamaDTO) => {
        const temp: any = await Temperatura.create({
          id_control: control.id,
          nro_cama: temperatura.nro_cama,
          t1: temperatura.t1,
          t2: temperatura.t2,
          t3: temperatura.t3,
          t4: temperatura.t4,
          t5: temperatura.t5,
          t6: temperatura.t6,
        });
      });
      res.json({ id_control: control.id });
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

export const uploadControlImage = async function (
  req: any,
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
    const fotoControl: any = await FotoControl.create({
      id_control: req.params.id_control,
      foto: req.file.buffer,
      descripcion: req.file.originalname.split(".jpg")[0] + "-" + new Date(),
    });
    if (!_.isNull(fotoControl)) {
      res.json({ id: fotoControl.id });
    } else {
      throw new BadRequest(
        "Solicitud errónea.",
        Error("Por favor ingrese una imagen válida.")
      );
    }
  } catch (e) {
    next(e);
  }
};

export const getControlImage = async function (
  req: any,
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
    const fotoControl: any = await FotoControl.findOne({
      where: { id: req.params.id },
    });
    if (!_.isNull(fotoControl)) {
      const buffer = fotoControl.foto.toString("base64");
      res.send(`data:image/jpeg;base64,${buffer}`);
    } else {
      throw new NotFound(
        "Solicitud inválida.",
        Error("No se encuentra la imagen requerida.")
      );
    }
  } catch (e) {
    next(e);
  }
};

export const controles = function (req: any, res: any) {
  console.log(req.query);

  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  return sequelize
    .query(
      "SELECT control.id, control.fecha_control, control.temperatura_aire, control.humedad_relativa, \
          control.co2, control.observaciones, sala.nombre as sala, personal.username as personal, turno.nombre as turno \
          FROM control_sala as control, sala, personal, turno \
          WHERE control.id_sala = sala.id AND control.id_turno = turno.id AND control.id_personal = personal.id \
          ORDER BY control.fecha_control",
      {
        type: "SELECT",
      }
    )
    .then((data: any) => {
      res.status(200).send(
        JSON.stringify(
          data.map(
            (control: any) =>
              ({
                id: control.id,
                fecha_control: control.fecha_control,
                temperatura_aire: control.temperatura_aire,
                humedad_relativa: control.humedad_relativa,
                co2: control.co2,
                observaciones: control.observaciones,
                sala: control.sala,
                personal: control.personal,
                turno: control.turno,
              } as ControlDTO)
          )
        )
      );
    })
    .catch((error) => {
      res.status(400).send(error);
    });
};
