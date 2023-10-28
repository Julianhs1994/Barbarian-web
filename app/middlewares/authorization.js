import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
//import {usuarios} from "../controllers/authentication.controller.js";
import { SetUsuario } from "../controllers/authentication.controller.js";

//config
dotenv.config()

function soloAdmin(req, res, next) {
  if (!req.session) {
    req.session = {};
  }

  const logeado = revisarCookie(req);
  if (logeado) {
    return next();
  } else {
    return res.redirect("/");
  }
}

function soloPublico(req, res, next) {
  if (!req.session) {
    req.session = {};
  }

  const logeado = revisarCookie(req);
  if (!logeado) {
    return next();
  } else {
    return res.redirect("/");
  }
}

function soloMain(req,res,next){
  if (!req.session) {
    req.session = {};
  }

  const logeado = revisarCookie(req);
  if(!logeado){
    return next();
  }else{
    req.session.usuario = true;
    return next();
  }
}

function revisarCookie(req) {
  try {
    const c = req.headers.cookie || "invitado";
    //console.log(c)
      if(c != "invitado"){
      const cookieJWT = c.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
      //*console.log(cookieJWT||"no cockie");//), cookieJWT)
      const decodificada = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET);
      //console.log("decodificada",decodificada.user);

      const usuarioArevisar = SetUsuario.some((usuario) => {
        return usuario.str_user === decodificada.user;
      });
      console.log(SetUsuario)
      //console.log("usuario a revisar:",usuarioArevisar);
      if (!usuarioArevisar) {
        return false;
      } else {
        return true;
      }
    }
  } catch(err) {
    console.log(err);
    return false;
  }
}

async function close(req,res,next){
  const cookieJWT = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
  //*console.log(cookieJWT||"no cockie");//), cookieJWT)
  const decodificada = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET);
  const usuario = decodificada.user;
  const deleted = deleteUserActive(usuario)
  if(deleted===true){
    return res.status(201).send({
      status: "Ok",
      message:`Todo fino`,
      redirect: "/"
    });
  }  
}

/* return res.status(201).send({
      status: "Ok",
      message: `Usuario agregado`,
      redirect: "/",
    });
    */

function deleteUserActive(user){
  const indiceUsuario = SetUsuario.findIndex(usuario => usuario.str_user === user);
  if (indiceUsuario !== -1) {
    // Eliminar el usuario del array utilizando splice()
    SetUsuario.splice(indiceUsuario, 1);
    console.log(SetUsuario); // Verificar el resultado  
    return true;
  }
  return false;
}

export const methods = {
  soloAdmin,
  soloPublico,
  soloMain,
  close,
};
