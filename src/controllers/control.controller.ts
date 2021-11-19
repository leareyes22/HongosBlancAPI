import { validationResult } from "express-validator";
import sequelize from "../services/DBConnection";
import express from "express";
import _ from "lodash";
import ControlSala from "../models/control-sala";
import Temperatura from "../models/temperatura";
import { BadRequest, NotFound } from "../errors/error";
import TemperaturaCamaDTO from "../dtos/temperatura-cama-dto";
import FotoControl from "../models/foto-control";
import {
  ControlDTO,
  GroupCantControlesDTO,
  GroupDataControlesDTO,
} from "../dtos/control-dto";

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

export const getControlImages = async function (
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

  return sequelize
    .query(
      "SELECT foto_control.foto as foto\
      FROM foto_control \
      WHERE foto_control.id_control = " +
        req.params.id_control,
      {
        type: "SELECT",
      }
    )
    .then((data: any) => {
      let controlImages = [] as any;
      data.map((element: any) => {
        let buffer = element.foto.toString("base64");
        controlImages.push(`data:image/jpeg;base64,${buffer}`);
      });
      res.status(200).send(JSON.stringify(controlImages));
    })
    .catch((error) => {
      res.status(400).send(error);
    });
};

export const getControlTemperaturas = async function (
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

  return sequelize
    .query(
      "SELECT temperatura.nro_cama, round( \
        cast(((temperatura.t1 + temperatura.t2 + temperatura.t3 + temperatura.t4 + \
             temperatura.t5 + temperatura.t6) / 6) as decimal), 1) as temp_prom \
      FROM temperatura\
      WHERE id_control = " +
        req.params.id_control +
        " ORDER BY temperatura.nro_cama",
      {
        type: "SELECT",
      }
    )
    .then((data: any) => {
      let controlTemps = [] as any;
      data.map((element: any) => {
        controlTemps.push({
          nro_cama: element.nro_cama,
          temp_prom: element.temp_prom,
        });
      });
      res.status(200).send(JSON.stringify(controlTemps));
    })
    .catch((error) => {
      res.status(400).send(error);
    });
};

export const controles = function (req: any, res: any) {
  console.log(req.query);

  const replacements: any = {};

  const desde_filter: String = req.query.desde
    ? " AND control.fecha_control >= :desde"
    : "";
  if (req.query.desde !== undefined) {
    replacements["desde"] = req.query.desde;
  }

  const hasta_filter: String = req.query.hasta
    ? " AND control.fecha_control <= :hasta"
    : "";
  if (req.query.hasta !== undefined) {
    replacements["hasta"] = req.query.hasta;
  }

  const personal_filter: String = req.query.personal
    ? " AND personal.id = :personal"
    : "";
  if (req.query.personal !== undefined) {
    replacements["personal"] = req.query.personal;
  }

  const turno_filter: String = req.query.turno
    ? " AND turno.id = :turno"
    : "";
  if (req.query.turno !== undefined) {
    replacements["turno"] = req.query.turno;
  }

  const sala_filter: String = req.query.sala ? " AND sala.id = :sala" : "";
  if (req.query.sala !== undefined) {
    replacements["sala"] = req.query.sala;
  }

  const co2_filter: String = req.query.co2 ? " AND control.co2 = :co2" : "";
  if (req.query.co2 !== undefined) {
    replacements["co2"] = req.query.co2;
  }

  const hum_relativa_filter: String = req.query.hum_relativa
    ? " AND control.humedad_relativa = :hum_relativa"
    : "";
  if (req.query.hum_relativa !== undefined) {
    replacements["hum_relativa"] = req.query.hum_relativa;
  }

  const temp_aire_filter: String = req.query.temp_aire
    ? " AND control.temperatura_aire = :temp_aire"
    : "";
  if (req.query.temp_aire !== undefined) {
    replacements["temp_aire"] = req.query.temp_aire;
  }

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
          WHERE control.id_sala = sala.id AND control.id_turno = turno.id AND control.id_personal = personal.id" +
        desde_filter +
        hasta_filter +
        personal_filter +
        sala_filter +
        turno_filter +
        co2_filter +
        temp_aire_filter +
        hum_relativa_filter +
        " ORDER BY control.fecha_control",
      {
        replacements: replacements,
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

export const controlesPorTurno = function (req: any, res: any) {
  console.log(req.query);

  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  return sequelize
    .query(
      "SELECT turno.nombre as turno, count(control_sala.id) as cant_controles \
      FROM control_sala, turno \
      WHERE control_sala.fecha_control > \
      date_trunc('month', CURRENT_DATE) - INTERVAL '1 year' AND control_sala.id_turno = turno.id \
      GROUP BY turno.id",
      {
        type: "SELECT",
      }
    )
    .then((data: any) => {
      let graphicData = {
        turnos: [],
        cant_controles: [],
      } as GroupCantControlesDTO;
      data.map((element: any) => {
        graphicData.turnos.push(element.turno);
        graphicData.cant_controles.push(parseInt(element.cant_controles, 10));
      });
      res.status(200).send(JSON.stringify(graphicData));
    })
    .catch((error) => {
      res.status(400).send(error);
    });
};

export const controlesData = function (req: any, res: any) {
  console.log(req.query);

  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  return sequelize
    .query(
      "SELECT TO_CHAR(control_sala.fecha_control, 'Month') as mes, \
        round(cast(avg(control_sala.temperatura_aire) as decimal), 1) as temp_aire_prom, \
        round(cast(avg(control_sala.humedad_relativa) as decimal), 1) as hum_rel_prom, \
        round(cast(avg(control_sala.co2) as decimal), 1) as co2_prom \
        FROM control_sala \
        WHERE control_sala.fecha_control > \
              date_trunc('month', CURRENT_DATE) - INTERVAL '6 months' \
        GROUP BY mes",
      {
        type: "SELECT",
      }
    )
    .then((data: any) => {
      let graphicData = {
        meses: [],
        temps_aire_prom: [],
        hums_rel_prom: [],
        co2s_prom: [],
      } as GroupDataControlesDTO;
      data.map((element: any) => {
        graphicData.meses.push(element.mes);
        graphicData.temps_aire_prom.push(parseFloat(element.temp_aire_prom));
        graphicData.hums_rel_prom.push(parseFloat(element.hum_rel_prom));
        graphicData.co2s_prom.push(parseFloat(element.co2_prom));
      });
      res.status(200).send(JSON.stringify(graphicData));
    })
    .catch((error) => {
      res.status(400).send(error);
    });
};
