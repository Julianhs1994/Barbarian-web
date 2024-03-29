import bcryptjs from "bcryptjs";
//import { json } from "express";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { getConnection } from "../database/database.js";
import { sendActivationEmail } from "../helper/email.helper.js";
import { sendAmountEmail } from "../helper/email.helper.js"; 
import {methods as products} from "../controllers/products.controller.js"
dotenv.config();
import crypto from "crypto";

export const SetUsuario = [{ str_user: "@@test@@pass",str_rol: "@@0@@rol" }];

async function register(req, res) {
  const {connection,pool} = await getConnection();
  try {
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
    const link2 = "https://barbarian-web-koqc.vercel.app/" + result[0].insertId;
    const link = "http://localhost:8080/" + result[0].insertId;
    sendActivationEmail(usr_email, link, link2);
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
  finally {
    await pool.end();
    console.log('register finalizado')
  };
}

//crypto client

import {privateKey, publicKey} from "../index.js"

async function login(req, res) { 
  const payload = req.body;

  let iv = Buffer.from(payload.iv, 'base64')
  //console.log('iv se pasa tal cual, codificado en base64')
  //console.log('iv: ' + iv.toString('base64'))
  //console.log('')

  let key = crypto.privateDecrypt({ key: privateKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING }, Buffer.from(payload.key, 'base64'))
  //console.log('La clave está cifrada con nuestra clave pública, por lo que solo nosotros podemos descifrarla con nuestra clave privada.')
  //console.log('key: ' + key.toString('base64'))
  //console.log('')

  const decryptor = crypto.createDecipheriv('aes-256-cbc', key, iv)
  const text = Buffer.concat([decryptor.update(payload.text, 'base64'), decryptor.final()]).toString('utf8')
  /*console.log('El texto dentro de la carga útil está cifrado con clave y iv.')
  console.log('y como la clave está cifrada, nadie excepto nosotros puede descifrar el texto')
  console.log('text: ' + text)
  console.log('')*/
  const userDecrypt = JSON.parse(text);//como lo enviamos json lo parseamos
  const {connection,pool} = await getConnection();
  try {

    //const { usr_email, usr_contrasenia } = req.body;
    const usr_email = userDecrypt.user;
    const usr_contrasenia = userDecrypt.password;
    
    if (!usr_email || !usr_contrasenia) {
      return res.status(400).send({
        status: 400,
        message: "Campos incompletos",
      });
    }


    const userQuery = await connection.query(
      "SELECT * FROM usuario WHERE usr_email = ?",
      [usr_email]
    );
    
    console.log(userQuery[0].length)
    console.log(userQuery[0])

    if (userQuery[0].length === 0) {
      console.log("entro")
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
      usr_contrasenia, usuarioArevisar.usr_contrasenia
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
      SetUsuario[indice] = { str_user: usuarioArevisar.usr_email, str_rol: nombre_rol };//lo mete
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
    await pool.end();
  }
  finally {
    await pool.end();
    console.log('login finalizado')
  };
}

async function activeUser(userId,req,res){
  //->Extraer Id: 
  const id = userId.replace(/:/g, '');
  //console.log("Id arreglada:"+id)
  const {connection,pool} = await getConnection();
  try{
    const [user] = await connection.query(
      "SELECT * FROM usuario WHERE usr_id = ?",[id]
    );

    if(user.length > 0 && user[0].usr_estado === 2) {
      await connection.query(
        "UPDATE usuario SET usr_estado = 1 WHERE usr_id = ?",[id]
      );
      //res.status(200).json({message:"cuenta activada con exito"})
      const activationSuccess = true;
      return activationSuccess;
      console.log("cuenta activada con exito")
    }else{
      /*res.status(400).json({
        message: "Enlace de activación inválido o la cuenta ya está activa",
      });*/
      const activationSuccess = false;
      return activationSuccess;
      console.log("Enlace de activacion invalido o la cuenta ya esta activa")
    }
  }catch(err){
    //res.status(500).json({ message: "Error en el servidor" });
    const activationSuccess = false;
    return activationSuccess;
  }
  finally {
    await pool.end();
    console.log('activar usuario finalizado')
  };
}

async function sendEmailPay(req,res,carrito){
  const cookies = req.headers.cookie ? req.headers.cookie.split('; ') : []; // Dividir las cookies en un arreglo
  
  const jwtCookie = cookies.find((cookie) => cookie.startsWith('jwt=')); // Buscar la cookie con el nombre 'jwt='
  
  if (jwtCookie) { // Verificar si se encontró la cookie 'jwt='
    //console.log("COOKIE:" + jwtCookie);
    
    // Decodificar el contenido de la cookie 'jwt='
    const cookieJWT = jwtCookie.slice(4); // Obtener el valor de la cookie 'jwt=' sin el prefijo 'jwt='
    const decodificada = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET);
    //console.log("//////////////////")
    let email = decodificada.user;
    //->Revisar integridad de precios de la compra:
    const integridad = await products.verifyValueIntegrity(carrito)
    //console.log(integridad)
    if (integridad == true){
      sendAmountEmail(email,carrito);
      console.log("correo Compra enviado")
      return true
    }else{
      return false
    }

  }  
}

export const methods = {
  login,
  register,
  activeUser,
  sendEmailPay
};
