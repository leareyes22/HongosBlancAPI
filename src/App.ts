import express, { Request, Response } from "express";
import cors from "cors";
import router from "./routes/routes";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";

import jwt from "express-jwt";
import { errorHandler } from "../src/errors/error";

const app = express();
const jwt_secret_key =
  "db3OIsj+BXE9NZDy0t8W3TcNekrF+2d/1sFnWG4HnV8TZY30iTOdtVWJG8abWvB1GlOgJuQZdcF2Luqm/hccMw==";

app.use(cors());
app.use(bodyParser.json());
if (!jwt_secret_key) {
  console.log("JWT_SECRET_KEY env variable not found");
  process.exit(123);
}

export const JWT_SECRET_KEY = jwt_secret_key;

app.use(
  jwt({ secret: jwt_secret_key, algorithms: ["HS256"] }).unless({
    path: ["/api/authentication/login", "/"],
  })
);

app.use("/api/", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("HongosBlancAPI running");
});

app.use(errorHandler);

app.listen(5001, () => {
  console.log("Server Started at Port, 5001");
});

console.log("You should manually add a user to the database.");
console.log(
  "For example for 'username'=user and 'password'=pass, use the hashed password " +
    bcrypt.hashSync("pass", 5)
);
