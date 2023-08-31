import express from "express";
import { validationResult } from "express-validator";
import _ from "lodash";
import sequelize from "../services/DBConnection";
import { BadRequest } from "../errors/error";
import Tarea from "../models/tarea";
import { transporter } from "../services/mail.service";
import moment from "moment";
import Personal from "../models/personal";
import TareaDTO from "../dtos/tarea-dto";
const { Op } = require("sequelize");

export const tareasDiaEmpleado = function (req: any, res: any) {
  console.log(req.query);

  const replacements: any = {};

  const fecha_filter: String = req.query.fecha
    ? " AND tarea.fecha_planificada >= :fecha::date AND tarea.fecha_planificada < (:fecha::date + '1 day'::interval)"
    : "";
  if (req.query.fecha !== undefined) {
    replacements["fecha"] = moment(req.query.fecha)
      .startOf("day")
      .format("YYYY-MM-DD");
  }

  const personal_filter: String = req.query.personal
    ? " AND tarea.id_personal_asignado = :personal"
    : "";
  if (req.query.personal !== undefined) {
    replacements["personal"] = req.query.personal;
  }

  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  return sequelize
    .query(
      "SELECT tarea.id, tarea.fecha_generada, tarea.descripcion, tarea.realizada, tarea.fecha_planificada, sala.nombre as sala, CONCAT(pc.nombre, ' ', pc.apellido) as personal_creador \
          FROM tarea, sala, personal pc \
          WHERE tarea.id_sala = sala.id AND tarea.id_personal_creador = pc.id " +
        personal_filter +
        fecha_filter +
        " ORDER BY tarea.fecha_planificada DESC",
      {
        replacements: replacements,
        type: "SELECT",
      }
    )
    .then((data: any) => {
      res.status(200).send(
        JSON.stringify(
          data.map(
            (tarea: any) =>
              ({
                id: tarea.id,
                fecha_generada: tarea.fecha_generada,
                descripcion: tarea.descripcion,
                realizada: tarea.realizada,
                fecha_planificada: tarea.fecha_planificada,
                sala: tarea.sala,
                personal: tarea.personal_creador,
                turno: tarea.turno,
              } as TareaDTO)
          )
        )
      );
    })
    .catch((error) => {
      res.status(400).send(error);
    });
};

export const tareasSemanaEmpleado = function (req: any, res: any) {
  console.log(req.query);

  const replacements: any = {};

  const fecha_filter: String = req.query.fecha
    ? " AND tarea.fecha_planificada >= :fecha::date AND tarea.fecha_planificada <= (:fecha::date + '8 days'::interval)"
    : "";
  if (req.query.fecha !== undefined) {
    replacements["fecha"] = moment(req.query.fecha)
      .startOf("week")
      .format("YYYY-MM-DD");
  }

  const personal_filter: String = req.query.personal
    ? " AND tarea.id_personal_asignado = :personal"
    : "";
  if (req.query.personal !== undefined) {
    replacements["personal"] = req.query.personal;
  }

  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  return sequelize
    .query(
      "SELECT tarea.id, tarea.fecha_generada, tarea.descripcion, tarea.realizada, tarea.fecha_planificada, sala.nombre as sala, CONCAT(pc.nombre, ' ', pc.apellido) as personal_creador \
          FROM tarea, sala, personal pc \
          WHERE tarea.id_sala = sala.id AND tarea.id_personal_creador = pc.id " +
        personal_filter +
        fecha_filter +
        " ORDER BY tarea.fecha_planificada DESC",
      {
        replacements: replacements,
        type: "SELECT",
      }
    )
    .then((data: any) => {
      res.status(200).send(
        JSON.stringify(
          data.map(
            (tarea: any) =>
              ({
                id: tarea.id,
                fecha_generada: tarea.fecha_generada,
                descripcion: tarea.descripcion,
                realizada: tarea.realizada,
                fecha_planificada: tarea.fecha_planificada,
                sala: tarea.sala,
                personal: tarea.personal_creador,
                turno: tarea.turno,
              } as TareaDTO)
          )
        )
      );
    })
    .catch((error) => {
      res.status(400).send(error);
    });
};

export const tareasDiaJefe = function (req: any, res: any) {
  console.log(req.query);

  const replacements: any = {};

  const fecha_filter: String = req.query.fecha
    ? " AND tarea.fecha_planificada >= :fecha::date AND tarea.fecha_planificada < (:fecha::date + '1 day'::interval)"
    : "";
  if (req.query.fecha !== undefined) {
    replacements["fecha"] = moment(req.query.fecha)
      .startOf("day")
      .format("YYYY-MM-DD");
  }

  const personal_filter: String = req.query.personal
    ? " AND tarea.id_personal_creador = :personal"
    : "";
  if (req.query.personal !== undefined) {
    replacements["personal"] = req.query.personal;
  }

  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  return sequelize
    .query(
      "SELECT tarea.id, tarea.fecha_generada, tarea.descripcion, tarea.realizada, tarea.fecha_planificada, sala.nombre as sala, CONCAT(pa.nombre, ' ', pa.apellido) as personal_asignado \
          FROM tarea, sala, personal pa \
          WHERE tarea.id_sala = sala.id AND tarea.id_personal_asignado = pa.id " +
        personal_filter +
        fecha_filter +
        " ORDER BY tarea.fecha_planificada DESC",
      {
        replacements: replacements,
        type: "SELECT",
      }
    )
    .then((data: any) => {
      res.status(200).send(
        JSON.stringify(
          data.map(
            (tarea: any) =>
              ({
                id: tarea.id,
                fecha_generada: tarea.fecha_generada,
                descripcion: tarea.descripcion,
                realizada: tarea.realizada,
                fecha_planificada: tarea.fecha_planificada,
                sala: tarea.sala,
                personal: tarea.personal_asignado,
                turno: tarea.turno,
              } as TareaDTO)
          )
        )
      );
    })
    .catch((error) => {
      res.status(400).send(error);
    });
};

export const tareasSemanaJefe = function (req: any, res: any) {
  console.log(req.query);

  const replacements: any = {};

  const fecha_filter: String = req.query.fecha
    ? " AND tarea.fecha_planificada >= :fecha::date AND tarea.fecha_planificada <= (:fecha::date + '8 days'::interval)"
    : "";
  if (req.query.fecha !== undefined) {
    replacements["fecha"] = moment(req.query.fecha)
      .startOf("week")
      .format("YYYY-MM-DD");
  }

  const personal_filter: String = req.query.personal
    ? " AND tarea.id_personal_creador = :personal"
    : "";
  if (req.query.personal !== undefined) {
    replacements["personal"] = req.query.personal;
  }

  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  return sequelize
    .query(
      "SELECT tarea.id, tarea.fecha_generada, tarea.descripcion, tarea.realizada, tarea.fecha_planificada, sala.nombre as sala, CONCAT(pa.nombre, ' ', pa.apellido) as personal_asignado \
          FROM tarea, sala, personal pa \
          WHERE tarea.id_sala = sala.id AND tarea.id_personal_asignado = pa.id " +
        personal_filter +
        fecha_filter +
        " ORDER BY tarea.fecha_planificada DESC",
      {
        replacements: replacements,
        type: "SELECT",
      }
    )
    .then((data: any) => {
      res.status(200).send(
        JSON.stringify(
          data.map(
            (tarea: any) =>
              ({
                id: tarea.id,
                fecha_generada: tarea.fecha_generada,
                descripcion: tarea.descripcion,
                realizada: tarea.realizada,
                fecha_planificada: tarea.fecha_planificada,
                sala: tarea.sala,
                personal: tarea.personal_asignado,
                turno: tarea.turno,
              } as TareaDTO)
          )
        )
      );
    })
    .catch((error) => {
      res.status(400).send(error);
    });
};

export const createTarea = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  console.log(req.query);
  const errors = validationResult(req);
  console.log(errors);

  console.log(req.body);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const tarea: any = await Tarea.create({
      fecha_generada: req.body.fecha_generada,
      descripcion: req.body.descripcion,
      realizada: false,
      fecha_planificada: req.body.fecha_planificada,
      id_sala: req.body.id_sala,
      id_personal_asignado: req.body.id_personal_asignado,
      id_personal_creador: req.body.id_personal_creador,
    });

    const personal: any = await Personal.findOne({
      where: { id: req.body.id_personal_asignado },
    });

    if (!_.isNull(tarea) && !_.isNull(personal)) {
      const mailOptions = {
        from: "hongosblanc@outlook.com",
        to: personal.getDataValue("email"),
        subject: "Tarea asignada",
        text:
          "Estimado empleado: le informamos que se le ha asignado una tarea a realizar el día " +
          moment(tarea.getDataValue("fecha_planificada"))
            .locale("es")
            .format("LL") +
          ", en la sala " +
          tarea.getDataValue("id_sala") +
          " que consiste en realizar lo siguiente: " +
          tarea.getDataValue("descripcion"),
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          res
            .status(200)
            .send(
              "Se ha creado la tarea exitosamente y se ha notificado via mail al destinatario."
            );
        }
      });
      res.status(200).send(JSON.stringify({ id_tarea: tarea.id }));
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

export const realizarTarea = async function (
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
    const tarea = await Tarea.findOne({
      where: { id: req.params.id },
    });
    if (!_.isNull(tarea)) {
      tarea.setDataValue("realizada", true);
      Personal.findAll({
        where: { [Op.or]: [{ id_rol: 1 }, { id_rol: 2 }] },
      })
        .then((jefes) => {
          jefes.map((jefe: any) => {
            const mailOptions = {
              from: "hongosblanc@outlook.com",
              to: jefe.email,
              subject: "Tarea realizada",
              text:
                "Estimado jefe: le informamos que se ha completado una tarea planificada a realizar el día " +
                moment(tarea.getDataValue("fecha_planificada"))
                  .locale("es")
                  .format("LL") +
                ", en la sala " +
                tarea.getDataValue("id_sala") +
                ", que consistía en realizar lo siguiente: " +
                tarea.getDataValue("descripcion"),
            };
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                res.status(400).send(error);
              }
            });
          });
        })
        .catch((error) => {
          res.status(400).send(error);
        });
      await tarea.save();
      res.send(
        "La tarea " +
          tarea.getDataValue("id") +
          " ha sido actualizada correctamente. Se notificará a los jefes de producción."
      );
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
