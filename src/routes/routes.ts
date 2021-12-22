import express from "express";
import { body, query } from "express-validator";
import { login } from "../controllers/authentication.controller";
import {
  controles,
  controlesData,
  controlesPorTurno,
  createControl,
  getControlImage,
  getControlImages,
  getControlTemperaturas,
  uploadControlImage,
} from "../controllers/control.controller";
import {
  cosechas,
  cosechasKg,
  cosechasPorProducto,
  cosechasPorTurno,
  createCosecha,
} from "../controllers/cosecha.controller";
import { producto, productos } from "../controllers/producto.controller";
import { rol, roles } from "../controllers/roles.controller";
import { sala, salas } from "../controllers/salas.controller";
import {
  createTarea,
  realizarTarea,
  tareasDiaEmpleado,
  tareasSemanaEmpleado,
} from "../controllers/tareas.controller";
import { turno, turnos } from "../controllers/turnos.controller";
import {
  deleteUser,
  empleados,
  getUserImage,
  registerUser,
  updateUser,
  uploadUserImage,
  user,
  users,
} from "../controllers/users.controller";
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
router.get("/control/images/:id_control", getControlImages);
router.get("/control/temperaturas/:id_control", getControlTemperaturas);

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
router.get(
  "/tareas_dia_empleado/list",
  query("fecha").isISO8601().toDate(),
  query("personal").isInt(),
  tareasDiaEmpleado
);
router.get(
  "/tareas_semana_empleado/list",
  query("fecha").isISO8601().toDate(),
  query("personal").isInt(),
  tareasSemanaEmpleado
);
router.post(
  "/tarea",
  body("fecha_generada").isISO8601().toDate(),
  body("descripcion").isString(),
  body("fecha_planificada").isISO8601().toDate(),
  body("id_sala").isInt(),
  body("id_personal_asignado").isInt(),
  body("id_personal_creador").isInt(),
  createTarea
);
router.put("/realizar_tarea/:id", realizarTarea);

// Users endpoints
router.post(
  "/user",
  body("username").isString(),
  body("password").isString(),
  body("email").isEmail(),
  body("nombre").isString(),
  body("apellido").isString(),
  body("id_rol").isInt(),
  registerUser
);
router.post(
  "/user/image/:id_personal",
  upload.single("image"),
  uploadUserImage
);
router.get("/user/image/:id_personal", getUserImage);
router.get("/user/:id", user);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);
router.get("/empleado/list", empleados);
router.get("/users/list", users);

// Roles endpoints
router.get("/rol/list", roles);
router.get("/rol/:id", rol);

// Gráficos de reportes endpoints
router.get("/reportes/controles_turno", controlesPorTurno);
router.get("/reportes/controles_data", controlesData);
router.get("/reportes/cosechas_turno", cosechasPorTurno);
router.get("/reportes/cosechas_producto", cosechasPorProducto);
router.get("/reportes/cosechas_kg", cosechasKg);

export default router;
