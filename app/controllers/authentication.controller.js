import bcryptjs from "bcryptjs";
//import { json } from "express";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { getConnection } from "../database/database.js";
import { sendActivationEmail } from "../helper/email.helper.js";
dotenv.config();


export const SetUsuario = [{ str_user: "@@test@@pass",str_rol: "@@0@@rol" }];

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
      usr_estado: 2,
    };

    const result = await connection.query("INSERT INTO usuario SET ?", usuario);

    //usuarios.push(usuario);
    const link = "https://barbarian-web-koqc.vercel.app/" + result[0].insertId;
    sendActivationEmail(usr_email, link);

    return res.status(201).send({
      status: "Ok",
      message: `Usuario agregado, revisa tu correo para activar tu cuenta`,
      redirect: "/",
    });
  } catch (error) {
    console.error(error);
    if (
      error &&
      error.code === "ER_DUP_ENTRY" &&
      error.sqlMessage.includes("usr_email")
    ) {
      return res.status(400).json({ message: "El correo ya está en uso" });
    } else {
      return res
        .status(500)
        .send({ status: "Error", message: "Error en el servidor" });
    }
  }
}

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
    //console.log("Revision",usuarioArevisar)

    if (usuarioArevisar.usr_estado !== 1) {
      return res.status(401).json({ message: "Usuario no activo" });
    }

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

    
    const usuarioRevisado = SetUsuario.find(
      (usuario) => usuario.str_user === usuarioArevisar.usr_email
    );
    //->si el usuario no esta en sesion:
    if (!usuarioRevisado) {
      const user_rol = usuarioArevisar.usr_rol;
      const query_nombre_rol = await connection.query("SELECT rol_nombre FROM rol WHERE rol_id=?",[user_rol]);
      const nombre_rol = query_nombre_rol[0][0].rol_nombre;
      const indice = SetUsuario.length;
      SetUsuario[indice] = { str_user: usuarioArevisar.usr_email, str_rol: nombre_rol };
    }

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

const activeUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const connection = await getConnection();

    const [user] = await connection.query(
      "SELECT * FROM usuario WHERE usr_id = ?",
      [userId]
    );

    if (user.length > 0 && user[0].usr_estado === 2) {
      await connection.query(
        "UPDATE usuario SET usr_estado = 1 WHERE usr_id = ?",
        [userId]
      );
      res.status(200).json({ message: "Cuenta activada con éxito" });
    } else {
      res.status(400).json({
        message: "Enlace de activación inválido o la cuenta ya está activa",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const methods = {
  login,
  register,
  activeUser,
};
