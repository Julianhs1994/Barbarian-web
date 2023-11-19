import express from "express";
import cookieParser from "cookie-parser";
const port = 8080;

//Fix para __dirname
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
//
import { methods as authentication } from "./controllers/authentication.controller.js";

//Middlewares
import { methods as authorizations } from "./middlewares/authorization.js";

//Controladores
import { methods as users} from "./controllers/users.controller.js";
import { methods as products } from "./controllers/products.controller.js";
//EJS
import expressEjsLayouts from "express-ejs-layouts";
//
import multer from "multer";

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
  //res.render("main", { isLoggedIn });
  //
  let prodList = [];
  const prodListParam = req.query.value;
  if (prodListParam){
    const decodedArrayData = JSON.parse(decodeURIComponent(prodListParam));
    prodList = Array.isArray(decodedArrayData) ? decodedArrayData : [];
    console.log(prodList)
  }
  try{
    res.render('main', {isLoggedIn, prodList});
  }catch(err){
    console.error(err);
    res.render('main', { isLoggedIn, prodList: []});
  }
  
});
app.get("/login", authorizations.soloPublico, (req, res) => {
  const isLoggedIn = req.session.usuario ? true : false;
  console.log(isLoggedIn);
  res.render("login", { isLoggedIn });
});
app.get("/register", authorizations.soloPublico, (req, res) => {
  const isLoggedIn = req.session.usuario ? true : false;
  res.render("register", { isLoggedIn });
});
app.get("/addproduct", authorizations.soloPublico,(req,res) => {
  const isLoggedIn = req.session.usuario ? true : false;
  res.render("addproduct", { isLoggedIn });
});

//app.get("/activate/:userId", authorizations.soloPublico, async (req, res) => {
app.get("/:userId", authorizations.soloPublico, async (req, res) => {
  const userId = req.params.userId;
  const isLoggedIn = req.session.usuario ? true : false;
  console.log(userId);
  try {
    const activationSuccess = await authorizations.activateUser(userId);
    res.render("activation", { activationSuccess, isLoggedIn });
  } catch (error) {
    res.render("activation", { activationSuccess: false, isLoggedIn });
  }
});

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


app.post('/productos', upload.single('pdc_imagen'), (req, res) => {
  const { pdc_fk_seccion,pdc_descripcion,pdc_fk_marca,pdc_fk_color,cant_xs,cant_s,cant_m,cant_l,cant_xl,pdc_valor } = req.body;
  const pdc_imagen = req.file.filename;
  //users.get(req, res); // Ejemplo de uso del método get en el controlador users
  methods.InsertNewProduct(pdc_fk_seccion,pdc_descripcion,pdc_fk_marca,pdc_fk_color,cant_xs,cant_s,cant_m,cant_l,cant_xl,pdc_valor,pdc_imagen)
  .then((response)=>{
    res.send(response)
  })
  .catch((error)=>{
    res.status(500).send('Error al guardar el producto');
  })
});  

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
