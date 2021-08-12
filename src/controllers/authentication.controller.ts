import express from "express";
import Personal from "../models/personal";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../App";
import { Unauthorized } from "../errors/error";
import _ from "lodash";
import sequelize from "../services/DBConnection";
import UserLoginDTO from "../dtos/user-login-dto";
import Rol from "../models/rol";

//const MAX_LOGIN_ATTEMPTS = 10;
const ACCESS_TOKEN_EXPIRATION_TIME = "1h"; // 1 HOUR

export const login = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const user = await Personal.findOne({
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
      const token = jwt.sign(
        { username: req.body.username, password: req.body.password },
        JWT_SECRET_KEY,
        {
          expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
        }
      );
      // TODO: include logic to use refresh tokens
      const rol: any = await Rol.findOne({
        where: { id: user.getDataValue("id_rol") },
      });
      if (!_.isNull(rol)) {
        const userResponse = {
          username: user.getDataValue("username"),
          role: rol.nombre,
          token: token,
        } as UserLoginDTO;
        res.json(userResponse);
      }
    }
  } catch (e) {
    next(e);
  }
};
