import express from "express";
import { validationResult } from "express-validator";
import _, { eq } from "lodash";
import { BadRequest, NotFound } from "../errors/error";
import sequelize from "../services/DBConnection";
import Personal from "../models/personal";
import bcrypt from "bcrypt";
import UserListDTO, { UserDTO } from "../dtos/user-list.dto";
import Rol from "../models/rol";
import FotoPersonal from "../models/foto-personal";

export const user = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const user: any = await Personal.findOne({
      where: { id: req.params.id },
    });
    if (!_.isNull(user)) {
      const rol: any = await Rol.findOne({
        where: { id: user.id_rol },
      });
      if (!_.isNull(rol)) {
        const userResponse = {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          apellido: user.apellido,
          rol: rol.nombre,
        } as UserDTO;
        res.json(userResponse);
      }
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
      email: req.body.email,
      nombre: req.body.nombre,
      apellido: req.body.apellido,
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
      if (req.body.email) {
        user.setDataValue("email", req.body.email);
      }
      if (req.body.nombre) {
        user.setDataValue("nombre", req.body.nombre);
      }
      if (req.body.apellido) {
        user.setDataValue("apellido", req.body.apellido);
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

export const uploadUserImage = async function (
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
    const fotoPersonal: any = await FotoPersonal.findOne({
      where: { id_personal: req.params.id_personal },
    });
    if (_.isNull(fotoPersonal)) {
      const nuevaFotoPersonal: any = await FotoPersonal.create({
        id_personal: req.params.id_personal,
        foto: req.file.buffer,
      });
      if (!_.isNull(nuevaFotoPersonal)) {
        res.json({ id: nuevaFotoPersonal.id });
      } else {
        throw new BadRequest(
          "Solicitud errónea.",
          Error("Por favor ingrese una imagen válida.")
        );
      }
    } else {
      fotoPersonal.setDataValue("foto", req.file.buffer);
      await fotoPersonal.save();
      res.json({ id: fotoPersonal.id });
    }
  } catch (e) {
    next(e);
  }
};

export const getUserImage = async function (
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
    const fotoPersonal: any = await FotoPersonal.findOne({
      where: { id_personal: req.params.id_personal },
    });
    if (!_.isNull(fotoPersonal)) {
      const buffer = fotoPersonal.foto.toString("base64");
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

export const users = async function (
  req: express.Request,
  res: express.Response
) {
  try {
    const data = await sequelize.query(
      "SELECT personal.id as id, personal.username as username, personal.email as email, personal.nombre as nombre, personal.apellido as apellido, rol.nombre as rol, rol.id as id_rol \
          FROM personal, rol \
          WHERE personal.id_rol = rol.id",
      {
        type: "SELECT",
      }
    );
    res.status(200).send(
      JSON.stringify(
        data.map(
          (user: any) =>
            ({
              id: user.id,
              username: user.username,
              email: user.email,
              nombre: user.nombre,
              apellido: user.apellido,
              rol: user.rol,
              id_rol: user.id_rol,
            } as UserListDTO)
        )
      )
    );
  } catch (error) {
    res.status(400).send(error);
  }
};

export const empleados = async function (
  req: express.Request,
  res: express.Response
) {
  try {
    const data = await sequelize.query(
      "SELECT personal.id as id, personal.username as username, rol.nombre as rol, rol.id as id_rol \
          FROM personal, rol \
          WHERE personal.id_rol = rol.id AND rol.id = 3",
      {
        type: "SELECT",
      }
    );
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
  } catch (error) {
    res.status(400).send(error);
  }
};
