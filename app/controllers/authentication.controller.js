import bcryptjs from "bcryptjs";
import { json } from "express";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { getConnection } from "../../../server/src/database/database.js";
dotenv.config();

export const usuarios = [
  {
    user: "aa",
    email: "aa",
    //user pass: aasd
    password: "$2a$05$fGacgfn9WJhn9974ScMEHubzxEFFH.N3XXwNuvAi1meg4PkwULP.m",
  },
];

async function login(req, res) {
  try {
    const { usr_email, usr_contrasenia } = req.body;

    if (!usr_email || !usr_contrasenia) {
      return res.status(400).send({
        status: 400,
        message: "Campos incompletos",
      });
    }

    const connection = await getConnection();

    const userQuery = await connection.query(
      "SELECT * FROM usuario WHERE usr_email = ?",
      [usr_email]
    );

    if (userQuery.length === 0) {
      return res.status(400).send({
        status: 400,
        message: "Usuario no encontrado",
      });
    }

    const usuarioArevisar = userQuery[0][0];

    const loginCorrecto = await bcryptjs.compare(
      usr_contrasenia,
      usuarioArevisar.usr_contrasenia
    );

    if (!loginCorrecto) {
      return res.status(400).send({
        status: 400,
        message: "Contraseña incorrecta",
      });
    }

    const token = jsonwebtoken.sign(
      {
        user: usuarioArevisar.usr_email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    const cookieOption = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
      path: "/",
    };

    res.cookie("jwt", token, cookieOption);
    res.status(200);
    res.send({ status: "Ok", message: "Usuario logeado", redirect: "/" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "Error", message: "Error en el servidor" });
  }
}

async function register(req, res) {
  try {
    const connection = await getConnection();
    const {
      usr_tipo_documento,
      usr_numero_documento,
      usr_nombre,
      usr_apellido,
      usr_email,
      usr_contrasenia,
    } = req.body;

    if (
      !usr_tipo_documento ||
      !usr_numero_documento ||
      !usr_nombre ||
      !usr_apellido ||
      !usr_email ||
      !usr_contrasenia
    ) {
      return res
        .status(400)
        .send({ status: 400, message: "Campos incompletos" });
    }

    const usuarioExistente = usuarios.find(
      (usuario) => usuario.usr_email === usr_email
    );

    if (usuarioExistente) {
      return res
        .status(400)
        .send({ status: "Error", message: "Este usuario ya existe" });
    }

    const salt = await bcryptjs.genSalt(5);
    const hashPassword = await bcryptjs.hash(usr_contrasenia, salt);

    const usuario = {
      usr_rol: 2,
      usr_tipo_documento,
      usr_numero_documento,
      usr_nombre,
      usr_apellido,
      usr_email,
      usr_contrasenia: hashPassword,
    };

    const result = await connection.query("INSERT INTO usuario SET ?", usuario);

    console.log(result);

    usuarios.push(usuario);

    return res.status(201).send({
      status: "Ok",
      message: `Usuario agregado`,
      redirect: "/",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: "Error", message: "Error en el servidor" });
  }
}

export const methods = {
  login,
  register,
};
