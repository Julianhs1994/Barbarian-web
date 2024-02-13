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
import { methods as limit } from "./middlewares/concurrency.js";

//Controladores

import { methods as users} from "./controllers/users.controller.js";
import { methods as products } from "./controllers/products.controller.js";
import { methods as seccions } from "./controllers/seccion_producto.controller.js";
import { methods as marcas } from "./controllers/marca_producto.controller.js";
import { methods as colores } from "./controllers/color_producto.controller.js";
import { methods as roles } from "./controllers/rol.controller.js";
import { methods as tipo } from "./controllers/tipo_documento.controller.js";
//EJS
import expressEjsLayouts from "express-ejs-layouts";

//multer
import multer from "multer";


import { methodsEnc as encrypted } from "./crypto/cryptos.js";
//fs
import { promises as fs } from 'fs';
//
import crypto from "crypto";
//session



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
app.use(express.static(__dirname + "/assets"));

app.use(express.static(__dirname + "/crypto"))
app.use(express.static(__dirname + "/crypto-client"))

//
app.use(express.json());
app.use(cookieParser());
//
app.use(expressEjsLayouts);
app.set("views",[ path.join(__dirname, "pages"),path.join(__dirname, "/pages/admin")]);
app.set("view engine", "ejs");
//
//import { config } from "dotenv";
import session from "express-session";


app.use(session({
  secret: 'jjhs', // Reemplaza 'mi_secreto_de_sesion' con un secreto de sesión seguro.
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false, // Establece 'secure' en 'false' para desarrollo local y 'true' para producción en HTTPS.
    maxAge: 1000 * 60 * 60 * 24 * 7 // Establece la duración de la sesión en 7 días (1 semana).
  },
}));

//crypto client
export const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});
//crypto client Ruta
app.get('/public', (req, res) => {

  console.log('Recibí una solicitud de clave pública.')
  res.setHeader("Content-Type", "text/plain")
  res.writeHead(200)
  res.end(publicKey)
});

//Rutas

app.get("/", authorizations.soloMain,async (req, res) => {
  //->Configuracion:
  const isLoggedIn = req.session.usuario ? true : false;
  res.locals.rol = "no-one";
  var rol = "";
  if(!req.session || !req.session.rol){
    rol = "Invitado";
    res.locals.rol = rol;
    res.locals.cantCar = 0;
    res.clearCookie('jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;');
  }else{
    rol = req.session.rol;
    res.locals.rol = rol;
    let carrito = req.session.carrito || [];
    res.locals.cantCar = carrito.length;
  }
  //
  let prodList = [];
  let value = req.query.gender;
  let page = "";
  let totalPages = "";
  let pageSize = "";
  if(value>0){
    const prodListParam = encrypted.decryptUrl( req.query.value );
    page = encrypted.decryptUrl( req.query.page );
    totalPages = encrypted.decryptUrl( req.query.totalPages )
    pageSize = encrypted.decryptUrl( req.query.pageSize )
    const decodedArrayData = JSON.parse(decodeURIComponent(prodListParam));
    prodList = Array.isArray(decodedArrayData) ? decodedArrayData : [];
  }
  //
  const resultThree = await products.getProdForSearch();
  //console.log(resultThree)
  try{
    //console.log('prodList'+prodList)
    res.render('main', {isLoggedIn, rol, prodList, currentPage: page, totalPages, pageSize, gender:value, resultThree });
  }catch(err){
    console.error(err);
    res.render('main', {isLoggedIn, rol, prodList: [], currentPage: page, totalPages, pageSize, gender:value, resultThree});
  }
  
});

app.get("/login", authorizations.soloPublico, (req, res) => {
  const isLoggedIn = req.session.usuario ? true : false;
  const rol = req.session && req.session.rol ? req.session.rol : "Invitado";
  res.locals.rol = rol;
  res.locals.cantCar = "0";  
  res.render("login", { isLoggedIn,rol });
});

app.get("/register", authorizations.soloPublico, (req, res) => {
  const isLoggedIn = req.session.usuario ? true : false;
  //
  var rol = "";
  if(!req.session || !req.session.rol){
    rol = "Invitado";
  res.locals.rol = rol;
  res.locals.cantCar = 0;
  }else{
    rol = req.session.rol;
  res.locals.rol = rol;
  let carrito = req.session.carrito || [];
    res.locals.cantCar = carrito.length;
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
  res.locals.cantCar = 0;
  }else{
    rol = req.session.rol;
  res.locals.rol = rol;
  let carrito = req.session.carrito || [];
    res.locals.cantCar = carrito.length;
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

app.get("/editproduct",authorizations.soloPublico,async (req,res)=>{
  const isLoggedIn = req.session.usuario ? true : false;
  //
  var rol = "";
  if(!req.session || !req.session.rol){
    rol = "Invitado";
  res.locals.rol = rol;
  res.locals.cantCar = 0;
  }else{
    let carrito = req.session.carrito || [];
    res.locals.cantCar = carrito.length;
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
  ///
  const {Nombre,Imagen,Seccion,Descripcion,Marca,Color,Valor,Xs,S,M,L,Xl,idProduct} = req.query;
  res.render('editproduct', {isLoggedIn,Seccion,arraySecciones,Nombre,Imagen,Descripcion,Marca,arrayMarcas,arrayColores,Color,Valor,Xs,S,M,L,Xl,idProduct})
})

app.get("/edituser",authorizations.soloPublico,async (req,res)=>{
  const isLoggedIn = req.session.usuario ? true : false;
  //
  var rol = "";
  if(!req.session || !req.session.rol){
    rol = "Invitado";
  res.locals.rol = rol;
  res.locals.cantCar = 0;
  }else{
    rol = req.session.rol;
  res.locals.rol = rol;
  let carrito = req.session.carrito || [];
    res.locals.cantCar = carrito.length;
  }
  //
  let arrayRoles = [];
  const decodedArrayDataRol = await (roles.getAllRol());
  console.log(decodedArrayDataRol)
  if (decodedArrayDataRol){
    arrayRoles = (decodedArrayDataRol);
    //console.log(arrayRoles.length)
  }
  let arrayTipo = [];
  const decodedArrayDataTipo = await (tipo.getAllTipo());
  if (decodedArrayDataTipo){
    arrayTipo = (decodedArrayDataTipo)
  }
  const {Rol,TipoDocumento,NumeroDocumento,Nombre,Apellido,Email,Estado,idUser} = req.query;
  res.render('edituser',{isLoggedIn,Rol,arrayRoles,TipoDocumento,arrayTipo,NumeroDocumento,Nombre,Apellido,Email,Estado,idUser})
});


app.get("/editarusuarios", async (req,res) => {
  const { idUser,usr_rol,usr_tipo_documento,usr_numero_documento,usr_nombre,usr_apellido,usr_email,usr_estado } = req.query;
  //console.log(req.query)
    
  const result = await users.EditUser(idUser,usr_rol,usr_tipo_documento,usr_numero_documento,usr_nombre,usr_apellido,usr_email,usr_estado);

  //console.log(result.boolean)
   
    if(result.boolean == true){
      console.log("Usuario Editado")
    }else{
      console.log("Usuario no Editado")
    }
    res.redirect('/admin');
  }
);


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

//Config Formulario para agregar productos(Admin)

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

//Config Formulario para editar productos(Admin)

app.post('/editarproductos', upload.single('pdc_imagen'), async (req, res) => {
  const { pdc_nombre, pdc_fk_seccion, pdc_descripcion, pdc_fk_marca, pdc_fk_color, cant_xs, cant_s, cant_m, cant_l, cant_xl, pdc_valor,idProduct,pdc_imagen_old } = req.body;
  let pdc_imagen;
  //->Si carga una imagen nueva:
  if (req.file && req.file.filename){
    pdc_imagen = req.file.filename;
    //->Eliminar imagen antigua:
    await fs.unlink(`app/assets/${pdc_imagen_old}`)
  //->Si no inserta imagen nueva, entonces inserta el dato antiguo:  
  }else{
    pdc_imagen = pdc_imagen_old
  }
  
    const result = await products.EditProduct(idProduct,pdc_nombre, pdc_fk_seccion, pdc_descripcion, pdc_fk_marca, pdc_fk_color, cant_xs, cant_s, cant_m, cant_l, cant_xl, pdc_valor, pdc_imagen);
    // Eliminar la imagen si no se guarda en la base de datos
    //console.log(result.boolean)
    if (result.boolean == false && pdc_imagen != ""){
      await fs.unlink(`app/assets/${pdc_imagen}`);
      console.log('Imagen eliminada');
    }else if(result.boolean == true){
      console.log("Producto Editado")
    }
    res.redirect('/admin'); 
  }
);

//->desplegar GET de la descripcion:
app.get("/description",authorizations.soloUsuario,async (req,res)=>{
  const isLoggedIn = req.session.usuario ? true : false;
  //
  var rol = "";
  if(!req.session || !req.session.rol){
    rol = "Invitado";
  res.locals.rol = rol;
  res.locals.cantCar = 0
  }else{
    rol = req.session.rol;
  res.locals.rol = rol;
  let carrito = req.session.carrito || [];
    res.locals.cantCar = carrito.length;
  }
  //
  let nombre_producto = req.query.Nombre;
  let imagen_producto = req.query.Imagen;
  let precio_producto = req.query.Valor;
  let seccion_producto = req.query.Seccion;
  let descripcion_producto = req.query.Descripcion;
  let marca_producto = req.query.Marca;
  let color_producto = req.query.Color;
  let CantXs = req.query.CantXs;
  let CantS = req.query.CantS;
  let CantM = req.query.CantM;
  let Cantl = req.query.Cantl;
  let Cantxl = req.query.Cantxl;
  let idProducto = req.query.idProducto;
  res.render('description',{ isLoggedIn,nombre_producto,imagen_producto,precio_producto,seccion_producto,descripcion_producto,marca_producto,color_producto,CantXs,CantS,CantM,Cantl,Cantxl,idProducto })

})

app.post("/api/description", products.getProdDetail);
//Rutas con functiones autenticacion
app.post("/api/register", authentication.register);
app.post("/api/login", authentication.login);

//Rutas con funciones autorizacion
app.post("/api/close", authorizations.close);
//Rutas con funciones PRODUCTOS
app.post("/api/getSectionProd", limit.limitConcurrency,products.getProdListFromCategory);
app.post("/api/deleteProduct", products.deleteProduct);
app.post("/api/getEditProduct",products.getEditProduct);
app.get("/api/getAllProducts", products.getAllproducts);
//Ruta para obtener producto por nombre
app.post("/api/searchProdFromName", products.searchProdFromName);
//Ruta para obtener producto por id y editar
app.post("/api/getEditProduct",)

//Rutas con funciones USUARIOS
app.get("/api/getAllUsers",users.getAllUsers);
app.post("/api/deleteUser",users.deleteUser);
app.post("/api/getEditUser",users.getEditUser);

//Ruta solo admin
app.get("/admin", authorizations.soloPublico/*soloAdmin*/, (req, res) => {
  const isLoggedIn = req.session.usuario ? true:false;
  //
  var rol = "";
  if(!req.session || !req.session.rol){
    rol = "Invitado";
  res.locals.rol = rol;
  res.locals.cantCar = 0
  }else{
    rol = req.session.rol;
  res.locals.rol = rol;
  let carrito = req.session.carrito || [];
    res.locals.cantCar = carrito.length;
  }
  //
  const data = null;
  res.render('Admin',{isLoggedIn})
});

//Ruta de activacion
app.post("/api/active", authentication.activeUser);

import { searchProducts } from './controllers/search.Controller.js';
// Ruta para manejar la solicitud de búsqueda
app.post('/search',async (req, res) => {
  const query = req.query.query;
  const gender = req.query.gender;
  // Utiliza la función de búsqueda para obtener los resultados
  const results = await searchProducts(query,gender);
  //console.log("result index:"+results)
  // Envía los resultados como respuesta al cliente
  res.status(200).send({results:results})
});

//ruta trocada poner de ultimo

app.get("/:userId", async (req, res) => {
  //
  var rol = "";
  if(!req.session || !req.session.rol){
    rol = "Invitado";
  res.locals.rol = rol;
  res.locals.cantCar = 0;
  }else{
    rol = req.session.rol;
  res.locals.rol = rol;
  let carrito = req.session.carrito || [];
  res.locals.cantCar = carrito.length;
  }
  //
  const userId = req.params.userId;
  console.log("id index:"+userId)
  const isLoggedIn = req.session.usuario ? true : false;
  //console.log(userId);
  try {
    const activationSuccess = await authentication.activeUser(userId);//await authorizations.activateUser(userId);
    res.render("activation", { activationSuccess, isLoggedIn });
  } catch (error) {
    res.render("activation", { activationSuccess: false, isLoggedIn });
  }
});

//Carrito

// Agregar producto al carrito
app.post('/agregar-al-carrito/:idProducto/:cantidad/:nombre', (req, res) => {
  const idProducto = req.params.idProducto;
  const cantidad = req.params.cantidad;
  const nombre = req.params.nombre;
  console.log("nombre:"+nombre)
  // Lógica para agregar el producto a la sesión del carrito
  if (!req.session) {
    req.session = {};
  }
  let carrito = req.session.carrito || [];
  // Verificar si el producto ya está en el carrito
  const productoExistente = carrito.find(producto => producto.id === idProducto);
  if (productoExistente) {
    productoExistente.cantidad+cantidad;
  } else {
    // Agregar el producto al carrito
    carrito.push({ id: idProducto, nombre:nombre ,cantidad: cantidad });
    res.locals.cantCar = carrito.length;
  }
  req.session.carrito = carrito; // Guardar el carrito actualizado en la sesión
  res.status(200).send({status:200,message:'producto agregado',redirect:"/",carrito:carrito})
  //console.log("posted")
  //res.redirect('back'); // Redirigir de vuelta a la página anterior
});

app.post('/obtenerProductos',async (req, res) => {
  if (/*!req.session ||*/ !req.session.carrito || req.session.carrito.length === 0) {
    // Si el carrito está vacío, enviar una respuesta indicando que está vacío
    res.status(201).send({status:201,message:'El carrito está vacío',redirect:"/"});
    console.log("1")
  } else {
    // Si el carrito no está vacío, enviar la lista de productos en el carrito
    res.status(200).send({status:200,message:"ok",productos: req.session.carrito});
    console.log("2")
  }
});