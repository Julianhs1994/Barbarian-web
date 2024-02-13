import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { SetUsuario } from "../controllers/authentication.controller.js";

//config
dotenv.config();

function soloAdmin(req, res, next) {
  if (!req.session) {
    req.session = {};
  }
  
//->verificar login rol//
  const logeado = revisarCookie(req);
  const rol = req.session.rol || "Invitado"
  if (logeado && rol == "Administrador") {
    req.session.usuario = true;
    return next();
  } else {
    return res.redirect("/");
  }
}

//->usuarios normales sin logearse:
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

//->usuarios normales logeados:
function soloUsuario(req,res,next){
  if (!req.session) {
    req.session = {};
  }

  
  const logeado = revisarCookie(req);
  if(logeado){
    req.session.usuario = true;
    return next()
  }else{
    return res.redirect("/")
  }
}

function soloMain(req, res, next) {
  if (!req.session) {
    req.session = {};
  }

  const logeado = revisarCookie(req);
  if (!logeado) {
    return next();
  } else {
    req.session.usuario = true;
    return next();
  }
}

/*function getDecCookie(req){
  //
  const c = req.headers.cookie || "invitado";
    console.log("Cookie",c)
    if (c != "invitado" && !c.includes("connect.sid") ) {
      const jwtCookie = c.split("; ").find((cookie)=>cookie.startsWith('jwt='));
      console.log("that cook:"+jwtCookie)
      //
      
      //->obtener cookie con jwt:
      const cookieJWT = req.headers.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("jwt="))
        .slice(4);
      //->verificar integridad del usuario:  
      const decodificada = jsonwebtoken.verify(
        cookieJWT,
        process.env.JWT_SECRET
      );
      //
      //->obtener indice de donde se encuentra el usuario en el array de sesion:
      const indice = SetUsuario.findIndex(usuario => usuario.str_user === decodificada.user);
      if (indice !== -1) {
      //->obtener el rol del usuario en sesion:
      const rol = SetUsuario[indice].str_rol;
      //->guardar rol en req.session:
      req.session.rol = rol;
      console.log("req rol",req.session.rol);
     
    
      } else {
        // El usuario no fue encontrado en SetUsuario
        // Manejar el error de alguna manera adecuada
        console.log("El usuario no fue encontrado");
      }
      //
      return decodificada;  
    }else{
      req.session.rol = "Invitado*";
      return "invitado"
    }  
}*/

function getDecCookie(req) {
  const cookies = req.headers.cookie ? req.headers.cookie.split('; ') : []; // Dividir las cookies en un arreglo
  
  const jwtCookie = cookies.find((cookie) => cookie.startsWith('jwt=')); // Buscar la cookie con el nombre 'jwt='
  
  if (jwtCookie) { // Verificar si se encontró la cookie 'jwt='
    console.log("that cook:" + jwtCookie);
    
    // Decodificar el contenido de la cookie 'jwt='
    const cookieJWT = jwtCookie.slice(4); // Obtener el valor de la cookie 'jwt=' sin el prefijo 'jwt='
    const decodificada = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET);
    
    // Resto de tu lógica para manejar la sesión
          //->obtener indice de donde se encuentra el usuario en el array de sesion:
          const indice = SetUsuario.findIndex(usuario => usuario.str_user === decodificada.user);
          if (indice !== -1) {
          //->obtener el rol del usuario en sesion:
          const rol = SetUsuario[indice].str_rol;
          //->guardar rol en req.session:
          req.session.rol = rol;
          console.log("req rol",req.session.rol);
        } else {
          // El usuario no fue encontrado en SetUsuario
          // Manejar el error de alguna manera adecuada
          console.log("El usuario no fue encontrado");
        }
        //
        return decodificada;  
    
  } else {
    req.session.rol = "Invitado*";
    return "invitado";
  }
}

function revisarCookie(req) {
  try {
    const deco = getDecCookie(req)
    if (deco != "invitado") {
      const usuarioArevisar = SetUsuario.some((usuario) => {
        return usuario.str_user === deco.user;
      });
      console.log(SetUsuario);
      if (!usuarioArevisar) {
        return false;
      } else {
        return true;
      }
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function close(req, res, next) {
  const cookieJWT = req.headers.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("jwt="))
    .slice(4);
  //*console.log(cookieJWT||"no cockie");//), cookieJWT)
  const decodificada = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET);
  const usuario = decodificada.user;
  const deleted = deleteUserActive(usuario);
  if (deleted === true) {
    return res.status(201).send({
      status: "Ok",
      message: `Todo fino`,
      redirect: "/",
    });
  }
}


function deleteUserActive(user) {
  const indiceUsuario = SetUsuario.findIndex(
    (usuario) => usuario.str_user === user
  );
  if (indiceUsuario !== -1) {
    // Eliminar el usuario del array utilizando splice()
    SetUsuario.splice(indiceUsuario, 1);
    console.log(SetUsuario); // Verificar el resultado
    return true;
  }
  return false;
}

async function activateUser(userId) {
  try {
    //console.log("USER ID:"+userId)
    const response = await fetch(
      //`https://barbarian-web-koqc.vercel.app/api/active/${userId}`,
      `api/active/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body:JSON.stringify({
          userId:userId
        })
      }
    );
    const res = await response.json();
    console.log(res.status)
    if (res.status == 200) {
      console.log("active status 200")
      const activationSuccess = true;
      return activationSuccess;
    } else {
      const activationSuccess = false;
      return activationSuccess;
    }
  } catch (error) {
    const activationSuccess = false;
    return activationSuccess;
  }
}

export const methods = {
  soloAdmin,
  soloPublico,
  soloMain,
  close,
  activateUser,
  soloUsuario
};
