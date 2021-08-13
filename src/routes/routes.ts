import express from "express";
import { body, query } from "express-validator";
import { login } from "../controllers/authentication.controller";
import { sala, salas } from "../controllers/salas.controller";
import { turnos } from "../controllers/turnos.controller";

var router = express.Router();

// Authentication endpoints
router.post(
  "/authentication/login",
  body("username").isString(),
  body("password").isString(),
  login
);

// Control endpoints
router.get("/control/turno/list", turnos);
router.get("/control/sala/list", salas);
router.get("/control/sala/:id", sala);

export default router;
