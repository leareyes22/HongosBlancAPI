import express from "express";
import Usuario from "../models/usuario";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../App";
import { BadRequest, Unauthorized } from "../errors/error";
import Rol from "../models/rol";
import _ from "lodash";
import sequelize from "../services/DBConnection";

const MAX_LOGIN_ATTEMPTS = 10;
const ACCESS_TOKEN_EXPIRATION_TIME = "1h"; // 1 HOUR

export const login = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const user = await Usuario.findOne({
      where: { username: req.body.username },
    });
    if (user === null) {
      throw new Unauthorized(
        "Invalid user and/or password",
        Error(`User ${req.body.username} not found`)
      );
    }
    //TODO: make the chages needed to inform the user that the account is blocked
    /*if (user.getDataValue('login_attempts') >= MAX_LOGIN_ATTEMPTS) {
            throw Error(`Too many login attempts for user ${req.body.username}, account blocked`)
        }*/

    if (!bcrypt.compareSync(req.body.password, user.getDataValue("password"))) {
      //user.setDataValue('login_attempts', user.getDataValue('login_attempts')+1)
      //await user.save()
      throw new Unauthorized(
        "Invalid user and/or password",
        Error(`Wrong password for user ${req.body.username}`)
      );
    } else {
      const token = jwt.sign({ username: req.body.username }, JWT_SECRET_KEY, {
        expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
      });
      // TODO: include logic to use refresh tokens
      const id = user.getDataValue("id_rol");
      const rol: any = await sequelize.query(
        'SELECT "nombre" from "rol" AS "rol" WHERE "rol"."id" = ' + id,
        {
          type: "SELECT",
        }
      );
      if (!_.isNull(rol)) {
        res.json({
          username: user.getDataValue("username"),
          role: rol[0].nombre,
          token: token,
        });
      }
    }
  } catch (e) {
    next(e);
  }
};