import { validationResult } from "express-validator";
import sequelize from "../services/DBConnection";
import express from "express";
import _ from "lodash";
import ControlSala from "../models/control-sala";
import Temperatura from "../models/temperatura";
import { BadRequest, Internal } from "../errors/error";
import TemperaturaCamaDTO from "../dtos/temperatura-cama-dto";
import FotoControl from "../models/foto-control";
var stream = require("stream");

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
      throw new Internal(
        "Error interno del servidor.",
        Error("Por favor contacte a soporte.")
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
      foto: req.file.buffer,
      descripcion: "fotito",
    });
    if (!_.isNull(fotoControl)) {
      res.json({ id: fotoControl.id });
    } else {
      throw new BadRequest(
        "Solicitud inválida.",
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
      throw new BadRequest(
        "No se encuentra la imagen requerida.",
        Error("No se encuentra la imagen requerida.")
      );
    }
  } catch (e) {
    next(e);
  }
};
