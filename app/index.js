import express from "express";
import cookieParser from "cookie-parser";
const port = 8080;

//Fix para __dirname

import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));


import { methods as authentication } from "./controllers/authentication.controller.js";

//Middlewares

import { methods as authorizations } from "./middlewares/authorization.js";

//Controladores

import { methods as users} from "./controllers/users.controller.js";
import { methods as products } from "./controllers/products.controller.js";
import { methods as seccions } from "./controllers/seccion_producto.controller.js";
import { methods as marcas } from "./controllers/marca_producto.controller.js";
import { methods as colores } from "./controllers/color_producto.controller.js";
//EJS
import expressEjsLayouts from "express-ejs-layouts";

//multer
import multer from "multer";


import { methodsEnc as encrypted } from "./crypto/cryptos.js";
//fs
import { promises as fs } from 'fs';

//Server
const app = express();
app.set("port", port);
app.listen(app.get("port"));
console.log("Servidor corriendo en el puerto", app.get("port"));

//Configuración
app.use(express.static(__dirname + "/public/"));
app.use(express.static(__dirname + "/pages/css"));
app.use(express.static(__dirname + "/pages/img"));
app.use(express.static(__dirname + "/pages/admin"));
app.use(express.static(__dirname + "/assets"))

app.use(express.static(__dirname + "/crypto"))
//
app.use(express.json());
app.use(cookieParser());
//
app.use(expressEjsLayouts);
app.set("views",[ path.join(__dirname, "pages"),path.join(__dirname, "/pages/admin")]);
app.set("view engine", "ejs");

//Rutas

app.get("/", authorizations.soloMain, (req, res) => {
  const isLoggedIn = req.session.usuario ? true : false;
  res.locals.rol = "no-one";
  var rol = "";
  if(!req.session || !req.session.rol){
    rol = "Invitado";
    res.locals.rol = rol;
    res.clearCookie('jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;');
  }else{
    rol = req.session.rol;
    res.locals.rol = rol;
  }
  //
  let prodList = [];
  let value = req.query.gender;
  //let prodListParam = "";
  let page = "";
  let totalPages = "";
  let pageSize = "";
  if(value>0){
    const prodListParam = encrypted.decryptUrl( req.query.value );
    page = encrypted.decryptUrl( req.query.page );
    totalPages = encrypted.decryptUrl( req.query.totalPages )
    pageSize = encrypted.decryptUrl( req.query.pageSize )
  /*}
  if (prodListParam){*/
    const decodedArrayData = JSON.parse(decodeURIComponent(prodListParam));
    console.log("decode:"+prodListParam)
    prodList = Array.isArray(decodedArrayData) ? decodedArrayData : [];
  }
  try{
    console.log('prodList'+prodList)
    res.render('main', {isLoggedIn, rol, prodList, currentPage: page, totalPages, pageSize, gender:value });
  }catch(err){
    console.error(err);
    res.render('main', {isLoggedIn, rol, prodList: [], currentPage: page, totalPages, pageSize, gender:value});
  }
  
});

app.get("/login", authorizations.soloPublico, (req, res) => {
  const isLoggedIn = req.session.usuario ? true : false;
  const rol = req.session && req.session.rol ? req.session.rol : "Invitado";
  res.locals.rol = rol;  
  res.render("login", { isLoggedIn,rol });
});

app.get("/register", authorizations.soloPublico, (req, res) => {
  const isLoggedIn = req.session.usuario ? true : false;
  //
  var rol = "";
  if(!req.session || !req.session.rol){
    rol = "Invitado";
  res.locals.rol = rol;
  }else{
    rol = req.session.rol;
  res.locals.rol = rol;
  }
  //
  res.render("register", { isLoggedIn });
});

app.get("/addproduct", authorizations.soloPublico,async (req,res) => {
  const isLoggedIn = req.session.usuario ? true : false;
  //
  var rol = "";
  if(!req.session || !req.session.rol){
    rol = "Invitado";
  res.locals.rol = rol;
  }else{
    rol = req.session.rol;
  res.locals.rol = rol;
  }
  //
  let arraySecciones = [];
  const decodedArrayData = await (seccions.getAllSeccion_Producto());
  if(decodedArrayData){
    arraySecciones = Array.isArray(decodedArrayData) ? decodedArrayData : [];
  }
  let arrayMarcas = [];
  const decodedArrayDataMarcas = await (marcas.getAllmarca_producto());
  if(decodedArrayDataMarcas){
    arrayMarcas = Array.isArray(decodedArrayDataMarcas) ? decodedArrayDataMarcas:[];
  }
  let arrayColores = [];
  const decodedArrayDataColor = await (colores.getAllcolor_producto());
  if(decodedArrayDataColor){
    arrayColores = Array.isArray(decodedArrayDataColor) ? decodedArrayDataColor: [];
  }
  //
  res.render("addproduct", { isLoggedIn, arraySecciones, arrayMarcas, arrayColores });
});

//prueba
/*app.get("/prueba",authorizations.soloAdmin,(req,res) =>{
  const isLoggedIn = req.session.usuario ? true : false;
  var rol = "";
  if(!req.session || !req.session.rol){
    rol = "Invitado";
  res.locals.rol = rol;
  }else{
    rol = req.session.rol;
  res.locals.rol = rol;
  }
  res.render('prueba', {isLoggedIn, rol})
})*/


//Ruta con Multer

// Configuración de Multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'app/assets/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

//Formulario para agregar usuarios(Admin)


app.post('/productos', upload.single('pdc_imagen'), async (req, res) => {
  const { pdc_nombre, pdc_fk_seccion, pdc_descripcion, pdc_fk_marca, pdc_fk_color, cant_xs, cant_s, cant_m, cant_l, cant_xl, pdc_valor } = req.body;
  let pdc_imagen;
  if (req.file && req.file.filename){
    pdc_imagen = req.file.filename;
  }else{
    pdc_imagen = ""
  }
  
    const result = await products.InsertNewProduct(pdc_nombre, pdc_fk_seccion, pdc_descripcion, pdc_fk_marca, pdc_fk_color, cant_xs, cant_s, cant_m, cant_l, cant_xl, pdc_valor, pdc_imagen);
    // Eliminar la imagen si no se guarda en la base de datos
    //console.log(result.boolean)
    if (result.boolean == false && pdc_imagen != ""){
      await fs.unlink(`app/assets/${pdc_imagen}`);
      console.log('Imagen eliminada');
    }else if(result.boolean == true){
      console.log("Producto agregado")
    }
    res.redirect('/addproduct'); 
  }
);



//Rutas con functiones autenticacion
app.post("/api/register", authentication.register);
app.post("/api/login", authentication.login);

//Rutas con funciones autorizacion
app.post("/api/close", authorizations.close);
//Rutas con funciones PRODUCTOS
app.post("/api/getSectionProd", products.getProdListFromCategory)

//Get con funciones
app.get("/api/getAllUsers",users.getAllUsers);

//Ruta solo admin
app.get("/admin", authorizations.soloAdmin, (req, res) => {
  //res.sendFile(__dirname + "/pages/admin/admin.html");
  const data = null;
  const isLoggedIn = req.session.usuario ? true:false;
  res.render('Admin',{isLoggedIn})
});

//Ruta de activacion
app.post("/api/active/:userId", authentication.activeUser);

import { searchProducts } from './controllers/search.Controller.js';
// Ruta para manejar la solicitud de búsqueda
app.post('/search',async (req, res) => {
  const query = req.query.query;

  // Utiliza la función de búsqueda para obtener los resultados
  const results = await searchProducts(query);
  //console.log("result index:"+results)
  // Envía los resultados como respuesta al cliente
  res.status(200).send({results:results})
});

//ruta trocada poner de ultimo

app.get("/:userId", authorizations.soloPublico, async (req, res) => {
  //
  var rol = "";
  if(!req.session || !req.session.rol){
    rol = "Invitado";
  res.locals.rol = rol;
  }else{
    rol = req.session.rol;
  res.locals.rol = rol;
  }
  //
  const userId = req.params.userId;
  const isLoggedIn = req.session.usuario ? true : false;
  //console.log(userId);
  try {
    const activationSuccess = await authorizations.activateUser(userId);
    res.render("activation", { activationSuccess, isLoggedIn });
  } catch (error) {
    res.render("activation", { activationSuccess: false, isLoggedIn });
  }
});