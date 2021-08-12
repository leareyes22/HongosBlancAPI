import express from "express";
import { body, query } from "express-validator";
import { login } from "../controllers/authentication.controller";
import { turnos } from "../controllers/turno.controller";

var router = express.Router();

// Authentication endpoints
router.post(
  "/authentication/login",
  body("username").isString(),
  body("password").isString(),
  login
);

//Turnos endpoints
router.get("/control/getTurnos", turnos);

export default router;
