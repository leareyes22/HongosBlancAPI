import express from "express";
import { validationResult } from "express-validator";
import _ from "lodash";
import { BadRequest } from "../errors/error";
import sequelize from "../services/DBConnection";
import Personal from "../models/personal";
import bcrypt from "bcrypt";
import UserListDTO from "../dtos/user-list.dto";
import Rol from "../models/rol";

export const registerUser = async function (
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
    const user = await Personal.create({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 5),
      id_rol: req.body.id_rol,
    });
    if (!_.isNull(user)) {
      const rol = await Rol.findOne({
        where: { id: req.body.id_rol },
      });
      if (!_.isNull(rol)) {
        res.send(
          JSON.stringify({
            id: user.getDataValue("id"),
            username: user.getDataValue("username"),
            rol: rol.getDataValue("nombre"),
          })
        );
      }
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

export const updateUser = async function (
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
    const user = await Personal.findOne({
      where: { id: req.params.id },
    });
    if (!_.isNull(user)) {
      if (req.body.id_rol) {
        user.setDataValue("id_rol", req.body.id_rol);
      }
      if (req.body.username) {
        user.setDataValue("username", req.body.username);
      }
      if (req.body.password) {
        user.setDataValue("password", bcrypt.hashSync(req.body.password, 5));
      }
      await user.save();
      res.send(
        "El usuario " +
          user.getDataValue("username") +
          " ha sido actualizado correctamente."
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

export const deleteUser = async function (
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
    const user = await Personal.findOne({
      where: { id: req.params.id },
    });
    if (!_.isNull(user)) {
      let username = user.getDataValue("username");
      user.destroy();
      res.send("El usuario " + username + " ha sido eliminado correctamente.");
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

export const users = function (req: express.Request, res: express.Response) {
  return sequelize
    .query(
      "SELECT personal.id as id, personal.username as username, rol.nombre as rol, rol.id as id_rol \
          FROM personal, rol \
          WHERE personal.id_rol = rol.id",
      {
        type: "SELECT",
      }
    )
    .then((data: any) => {
      res.status(200).send(
        JSON.stringify(
          data.map(
            (user: any) =>
              ({
                id: user.id,
                username: user.username,
                rol: user.rol,
                id_rol: user.id_rol,
              } as UserListDTO)
          )
        )
      );
    })
    .catch((error) => {
      res.status(400).send(error);
    });
};
