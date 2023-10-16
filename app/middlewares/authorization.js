import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
//Import para probar 
import {usuarios} from "../controllers/authentication.controller.js";
dotenv.config()

function soloAdmin(req, res, next) {
  //console.log(req.headers.cookie);
  const logeado = revisarCookie(req);
  if (logeado) {
    return next();
  } else {
    return res.redirect("/");
  }
}

function soloPublico(req, res, next) {
  const logeado = revisarCookie(req);
  if (!logeado) {
    return next();
  } else {
    return res.redirect("/");
  }
}

function revisarCookie(req) {
  try {
    const cookieJWT = req.headers.cookie
      .split("; ")
      .find((cookie) => cookie.startWith("jwt="))
      .slice(4);
    //console.log("COOKIE", cookieJWT)
    const decodificada = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET);
    console.log(decodificada);
    const usuarioArevisar = usuarios.find(
      (usuario) => usuario.user === decodificada.user
    );
    console.log(usuarioArevisar);
    if (!usuarioArevisar) {
      return false;
    } else {
      return true;
    }
  } catch {
    return false;
  }
}

export const methods = {
  soloAdmin,
  soloPublico,
};
