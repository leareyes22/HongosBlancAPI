import express from "express";
import { body, query } from "express-validator";
import { login } from "../controllers/authentication.controller";
import { createControl } from "../controllers/control.controller";
import { sala, salas } from "../controllers/salas.controller";
import { tareas } from "../controllers/tareas.controller";
import { turno, turnos } from "../controllers/turnos.controller";

var router = express.Router();

// Authentication endpoints
router.post(
  "/authentication/login",
  body("username").isString(),
  body("password").isString(),
  login
);

// Salas endpoints
router.get("/sala/list", salas);
router.get("/sala/:id", sala);

// Turnos endpoints
router.get("/turno/list", turnos);
router.get("/turno/:id", turno);

// Control endpoints
router.post(
  "/control",
  body("fecha_control").isISO8601().toDate(),
  body("temperatura_aire").isFloat(),
  body("humedad_relativa").isFloat(),
  body("co2").isInt(),
  body("observaciones").isString(),
  body("temperaturas").isArray(),
  createControl
);

// Tareas endpoints
router.get("/tarea/list", tareas);

export default router;
