import { config } from "dotenv";

config(); //habilita variables de entorno declaradas en el archivo .env

//variables dentro de .env para no compartirlas
export default {
  host: process.env.HOST || "", //si hay un error manda un string vacio
  database: process.env.DATABASE || "",
  user: process.env.USER || "",
  password: process.env.PASSWORD || "",
  port: process.env.DB_PORT || "",
};
