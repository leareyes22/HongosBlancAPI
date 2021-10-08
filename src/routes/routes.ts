import express from "express";
import { body, query } from "express-validator";
import { login } from "../controllers/authentication.controller";
import {
  controles,
  createControl,
  getControlImage,
  uploadControlImage,
} from "../controllers/control.controller";
import { cosechas, createCosecha } from "../controllers/cosecha.controller";
import { producto, productos } from "../controllers/producto.controller";
import { sala, salas } from "../controllers/salas.controller";
import { tareas } from "../controllers/tareas.controller";
import { turno, turnos } from "../controllers/turnos.controller";
import { deleteUser, updateUser, users } from "../controllers/users.controller";
const multer = require("multer");
const upload = multer();

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
router.post(
  "/control/image/:id_control",
  upload.single("image"),
  uploadControlImage
);
router.get("/control/image/:id", getControlImage);
router.get(
  "/control/list",
  query("desde").optional().isISO8601().toDate(),
  query("hasta").optional().isISO8601().toDate(),
  query("personal").optional().isString(),
  query("turno").optional().isString(),
  query("sala").optional().isString(),
  query("co2").optional().isDecimal(),
  query("temp_aire").optional().isDecimal(),
  query("hum_relativa").optional().isDecimal(),
  controles
);

// Cosecha endpoints
router.post(
  "/cosecha",
  body("fecha_cosechada").isISO8601().toDate(),
  body("kg_cosechados").isFloat(),
  body("observaciones").isString(),
  createCosecha
);
router.get(
  "/cosecha/list",
  query("desde").optional().isISO8601().toDate(),
  query("hasta").optional().isISO8601().toDate(),
  query("producto").optional().isString(),
  query("personal").optional().isString(),
  query("turno").optional().isString(),
  query("sala").optional().isString(),
  cosechas
);

// Productos endpoints
router.get("/producto/list", productos);
router.get("/producto/:id", producto);

// Tareas endpoints
router.get("/tarea/list", tareas);

// Users endpoints
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);
router.get("/user/list", users);

export default router;
