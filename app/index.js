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
app.get("/",authorizations.soloPublico,(req,res)=> {
    //res.sendFile(__dirname+"/pages/main.html");
    res.render('main')
});
app.get("/login",(req,res)=> {
    //.sendFile(__dirname+"/pages/login.html")
    res.render('login')
});
app.get("/register",authorizations.soloPublico,(req,res)=> {
    //res.sendFile(__dirname+"/pages/register.html")
    res.render('register')
});

//Rutas con functiones
app.post("/api/register",authentication.register);
app.post("/api/login",authentication.login);



//Ruta solo admin
app.get("/register",authorizations.soloAdmin,(req,res)=> {
    res.sendFile(__dirname+"/pages/admin/admin.html")
})
