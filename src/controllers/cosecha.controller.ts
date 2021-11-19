import { validationResult } from "express-validator";
import sequelize from "../services/DBConnection";
import express from "express";
import _ from "lodash";
import Cosecha from "../models/cosecha";
import { BadRequest } from "../errors/error";
import CreateCosechaDTO, {
  GroupCantCosechasDTO,
  GroupCosechasKgDTO,
  GroupCosechasPorProductoDTO,
} from "../dtos/cosecha-dto";
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

  const replacements: any = {};

  const desde_filter: String = req.query.desde
    ? " AND cosecha.fecha_cosechada >= :desde"
    : "";
  if (req.query.desde !== undefined) {
    replacements["desde"] = req.query.desde;
  }

  const hasta_filter: String = req.query.hasta
    ? " AND cosecha.fecha_cosechada <= :hasta"
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

  const producto_filter: String = req.query.producto
    ? " AND producto.id = :producto"
    : "";
  if (req.query.producto !== undefined) {
    replacements["producto"] = req.query.producto;
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
          WHERE cosecha.id_sala = sala.id AND cosecha.id_turno = turno.id AND cosecha.id_personal = personal.id AND cosecha.id_producto = producto.id" +
        desde_filter +
        hasta_filter +
        producto_filter +
        personal_filter +
        sala_filter +
        turno_filter +
        " ORDER BY cosecha.fecha_cosechada",
      {
        replacements: replacements,
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

export const cosechasPorTurno = function (req: any, res: any) {
  console.log(req.query);

  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  return sequelize
    .query(
      "SELECT turno.nombre as turno, count(cosecha.id) as cant_cosechas \
      FROM cosecha, turno \
      WHERE cosecha.fecha_cosechada > \
      date_trunc('month', CURRENT_DATE) - INTERVAL '1 year' AND cosecha.id_turno = turno.id \
      GROUP BY turno.id",
      {
        type: "SELECT",
      }
    )
    .then((data: any) => {
      let graphicData = {
        turnos: [],
        cant_cosechas: [],
      } as GroupCantCosechasDTO;
      data.map((element: any) => {
        graphicData.turnos.push(element.turno);
        graphicData.cant_cosechas.push(parseInt(element.cant_cosechas, 10));
      });
      res.status(200).send(JSON.stringify(graphicData));
    })
    .catch((error) => {
      res.status(400).send(error);
    });
};

export const cosechasPorProducto = function (req: any, res: any) {
  console.log(req.query);

  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  return sequelize
    .query(
      "SELECT producto.nombre as producto, round((count(cosecha.id) / cast(total.count as decimal)), 1) as porcentaje \
      FROM cosecha, producto, (SELECT count(c.id) FROM cosecha as c) as total \
      WHERE cosecha.id_producto = producto.id and \
      cosecha.fecha_cosechada > date_trunc('month', CURRENT_DATE) - INTERVAL '1 year' \
      GROUP BY producto.nombre, total.count",
      {
        type: "SELECT",
      }
    )
    .then((data: any) => {
      let graphicData = {
        productos: [],
        porcentajes: [],
      } as GroupCosechasPorProductoDTO;
      data.map((element: any) => {
        graphicData.productos.push(element.producto);
        graphicData.porcentajes.push(parseFloat(element.porcentaje));
      });
      res.status(200).send(graphicData);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
};

export const cosechasKg = function (req: any, res: any) {
  console.log(req.query);

  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  return sequelize
    .query(
      "SELECT TO_CHAR(cosecha.fecha_cosechada, 'Month') as mes, sum(cosecha.kg_cosechados) as total_kg \
      FROM cosecha \
      WHERE cosecha.fecha_cosechada > \
      date_trunc('month', CURRENT_DATE) - INTERVAL '6 months' \
      GROUP BY mes",
      {
        type: "SELECT",
      }
    )
    .then((data: any) => {
      let graphicData = {
        meses: [],
        totales_kg: [],
      } as GroupCosechasKgDTO;
      data.map((element: any) => {
        graphicData.meses.push(element.mes);
        graphicData.totales_kg.push(parseFloat(element.total_kg));
      });
      console.log(graphicData);
      res.status(200).send(graphicData);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
};
