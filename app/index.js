import express from "express";
import cookieParser from "cookie-parser";
const port = 8080;

//Fix para __dirname
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
//
import { methods as authentication } from "./controllers/authentication.controller.js";
//
import { methods as authorizations } from "./middlewares/authorization.js";
//EJS
import expressEjsLayouts from "express-ejs-layouts";


//Server
const app = express();
app.set('port',port);
app.listen(app.get('port'));
console.log('Servidor corriendo en el puerto',app.get('port'));

//Configuración
app.use(express.static(__dirname+"/public/"));
app.use(express.static(__dirname+"/pages/css"));
app.use(express.static(__dirname+"/pages/img"));
//
app.use(express.json());
app.use(cookieParser());
//
app.use(expressEjsLayouts)
app.set("views", path.join(__dirname, "pages"));
app.set("view engine", "ejs");

//Rutas
/*app.get('/', (req, res) => {
    res.render('index', { title: 'Mi página EJS' });
  });*/

app.get("/",authorizations.soloMain,(req,res)=> {
    const isLoggedIn = req.session.usuario ? true : false;
    res.render('main',{isLoggedIn});
    console.log("loggedIn:",isLoggedIn);
});
app.get("/login",authorizations.soloPublico,(req,res)=> {
    const isLoggedIn = req.session.usuario ? true : false;
    console.log(isLoggedIn)
    res.render('login', {isLoggedIn})
});
app.get("/register",authorizations.soloPublico,(req,res)=> {
    const isLoggedIn = req.session.usuario ? true : false;
    res.render('register', {isLoggedIn});
});

//Rutas con functiones autenticacion
app.post("/api/register",authentication.register);
app.post("/api/login",authentication.login);
//Rutas con funciones autorizacion
app.post("/api/close",authorizations.close);



//Ruta solo admin
app.get("/register",authorizations.soloAdmin,(req,res)=> {
    res.sendFile(__dirname+"/pages/admin/admin.html")
})
