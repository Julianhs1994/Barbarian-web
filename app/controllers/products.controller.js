import { getConnection } from "../database/database.js";
import { methodsEnc } from "../crypto/cryptos.js";
//fs
import { promises as fs } from 'fs';

//->Insertar producto nuevo:
async function InsertNewProduct(pdc_nombre,pdc_fk_seccion,pdc_descripcion,pdc_fk_marca,pdc_fk_color,cant_xs,cant_s,cant_m,cant_l,cant_xl,pdc_valor,pdc_imagen){

  //->Comprobar campos vacios:
  if(!pdc_nombre || !pdc_fk_seccion || !pdc_descripcion || !pdc_fk_marca || !pdc_fk_color || !cant_xs || !cant_s || !cant_m || !cant_l || !cant_xl || !pdc_valor || !pdc_imagen || pdc_imagen == ""){
    return ({boolean:false})
  }
  const {connection,pool} = await getConnection();
  try{
    let pdc_estado = 1;
    const sql = 'INSERT INTO producto (pdc_nombre,pdc_fk_seccion,pdc_descripcion,pdc_fk_marca,pdc_fk_color,cant_xs,cant_s,cant_m,cant_l,cant_xl,pdc_valor,pdc_imagen,pdc_estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(sql, [pdc_nombre,parseInt(pdc_fk_seccion),pdc_descripcion,parseInt(pdc_fk_marca),parseInt(pdc_fk_color),cant_xs,cant_s,cant_m,cant_l,cant_xl,pdc_valor,pdc_imagen,pdc_estado]);
    return ({boolean:true});
  }catch(err){
    console.error(err)
    await pool.end();
    return ({boolean:true})
  }
  finally {
    await pool.end();
    console.log('insertar producto finalizado')
  }  
}

//->Editar producto existente:
async function EditProduct(idProduct,pdc_nombre,pdc_fk_seccion,pdc_descripcion,pdc_fk_marca,pdc_fk_color,cant_xs,cant_s,cant_m,cant_l,cant_xl,pdc_valor,pdc_imagen){

  if(!pdc_nombre || !pdc_fk_seccion || !pdc_descripcion || !pdc_fk_marca || !pdc_fk_color || !cant_xs || !cant_s || !cant_m || !cant_l || !cant_xl || !pdc_valor || !pdc_imagen || pdc_imagen == ""){
    return ({boolean:false})
  }
  const {connection,pool} = await getConnection();
  try{
    let pdc_id = idProduct;
    const sql = 'UPDATE producto SET pdc_nombre = ?, pdc_fk_seccion = ?, pdc_descripcion = ?, pdc_fk_marca = ?,pdc_fk_color = ?,cant_xs = ?,cant_s = ?,cant_m = ?,cant_l = ?,cant_xl = ?,pdc_valor = ?,pdc_imagen = ? WHERE pdc_id = ?';
    connection.query(sql, [pdc_nombre,parseInt(pdc_fk_seccion),pdc_descripcion,parseInt(pdc_fk_marca),parseInt(pdc_fk_color),cant_xs,cant_s,cant_m,cant_l,cant_xl,pdc_valor,pdc_imagen,pdc_id]);
    return ({boolean:true});
  }catch(err){
    console.error(err)
    await pool.end();
    return ({boolean:true})
  }
  finally {
    await pool.end();
    console.log('editar producto finalizado')
  }  
}


  
async function getProdListFromCategory(req,res,next){
  const {connection,pool} = await getConnection();
  try{
    const page = req.body.page || 1; // Página 
    const pageSize = req.body.pageSize ||5; // Tamaño de página deseado
    const value = req.body.value;
  
    if(!req.session){
      req.session = {}
    }
    // Ajusta tu consulta SQL para obtener solo los productos de la página actual
    const offset = (page - 1) * pageSize;
    const query = "SELECT producto.pdc_id,seccion.sec_nombre,producto.pdc_nombre,producto.cant_xs,producto.cant_s,producto.cant_m,producto.cant_l,producto.cant_xl,marca.mar_nombre,color.col_nombre,producto.pdc_descripcion,producto.pdc_valor,producto.pdc_imagen FROM producto INNER JOIN color_producto color INNER JOIN seccion_producto seccion INNER JOIN marca_producto marca ON producto.pdc_fk_marca = marca.mar_id WHERE pdc_fk_seccion=? LIMIT ? OFFSET ?";
    const result = await connection.query(query, [value, pageSize, offset]);
    const arrayData = result[0];
    //
    const totalCount = await connection.query("SELECT COUNT(*) as total FROM producto WHERE pdc_fk_seccion=?", [value]);
    const totalItems = totalCount[0][0].total;
    const totalPages = Math.ceil(totalItems / pageSize);
    //
    const encodedArrayData = decodeURIComponent(JSON.stringify(arrayData));
    //console.log(methodsEnc.encryptUrl(encodedArrayData))
    const ArrayEncrypt = methodsEnc.encryptUrl(encodedArrayData)
    const pageEncrypt = methodsEnc.encryptUrl(page.toString());
    //console.log(pageEncrypt)
    const totalPagesEncrypt = methodsEnc.encryptUrl(totalPages.toString());
    //console.log(totalPagesEncrypt)
    const pageSizeEncrypt = methodsEnc.encryptUrl(pageSize.toString());
    //
    //console.log("pageEncrypt decrypt", methodsEnc.decryptUrl(pageEncrypt))
    const redirectUrl = ("/?value=" + ArrayEncrypt + "&page=" + pageEncrypt + "&totalPages="+totalPagesEncrypt + "&pageSize="+ pageSizeEncrypt +"&gender="+value).toString() ;
    return res.status(201).send({
      status:"Ok",
      message:"Resultado Exitoso",
      redirect:redirectUrl
    });


  }catch(err){
    console.error(err);
    return null;
  }
  finally {
    await pool.end();
    console.log('obtener categoria finalizado')
  };

}  

async function searchProdFromName(req,res){
  const {connection,pool} = await getConnection();
  try{
    const name = req.body.value;
    const sql = await connection.query("SELECT * FROM producto WHERE pdc_nombre =? ",[name]);
    const arrayData = sql[0];
    //->insertar en busquedas:
    if (arrayData.length === 0){
      return 
    }else{
      let id;
      arrayData.forEach(element => {
        id = element.pdc_id;
      });
      const sql2 = await connection.query("SELECT * FROM busquedas WHERE pdc_id =?",[id]);
      //console.log("lenght: "+sql2[0].length)
      if(sql2[0].length === 0){
        //console.log(sql2[0])
        console.log("el id:"+id+" No existe en busquedas,insertando...")
        const insert = connection.query("INSERT INTO busquedas (pdc_id,contador) VALUES (?,?)",[id,0]);
        console.log("Insercion realizada en busquedas, id de producto="+id);
      }else{
        console.log("El producto con id="+id+" Ya esta insertado en busquedas, actualizando contador...")
        let count;
        sql2[0].forEach(objeto=>{
          count = objeto.contador;
        });
        let suma = parseInt(count) + 1;
        try{
        const insertB = await connection.query(`UPDATE busquedas SET contador=${suma} WHERE pdc_id=${id}`);
        console.log("Busqueda actualizada, producto_id:"+id+" Contador="+suma)
        }catch(err){
          await pool.end();
          console.error(insertB)
        }
      }

    }
    
    //
    const value = req.query.gender || 1;
    const page = 1;
    const totalPages = 1;
    const pageSize = 1;
    //
    const encodedArrayData = decodeURIComponent(JSON.stringify(arrayData));
    const ArrayEncrypt = methodsEnc.encryptUrl(encodedArrayData)
    const pageEncrypt = methodsEnc.encryptUrl(page.toString());
    const totalPagesEncrypt = methodsEnc.encryptUrl(totalPages.toString());
    const pageSizeEncrypt = methodsEnc.encryptUrl(pageSize.toString());
    //
    const redirectUrl = ("/?value=" + ArrayEncrypt + "&page=" + pageEncrypt + "&totalPages="+totalPagesEncrypt + "&pageSize="+ pageSizeEncrypt +"&gender="+value).toString() ;
    res.status(200).send({status:200,message:"Ok",redirect:redirectUrl})
  }catch(err){
    await pool.end();
    console.error(err)
  }
  finally{
    await pool.end();
    console.log('buscar producto por nombre finalizado')
  }  
}

//->Obtener productos con mas busquedas:
async function getProdForSearch() {
  const connectionData = await getConnection();
  if (connectionData) {
    const { connection, pool } = connectionData;
    try {
      const sql = await connection.query("SELECT pdc_nombre,pdc_imagen,contador FROM producto INNER JOIN busquedas ON producto.pdc_id = busquedas.pdc_id ORDER BY busquedas.contador DESC LIMIT 3");
      const arrayData = sql[0];
      return arrayData;
    } catch (error) {
      console.log(error);
      await pool.end();
    } finally {
      console.log('obtener productos con mas busquedas finalizado');
      await pool.end();
    }
  } else {
    // Manejo del error o aviso de que no se pudo obtener la conexión
    console.log('Error obteniendo getConecction()');
  }
}
async function getProdDetail(req,res){
  let Arrays = JSON.parse(req.body.value);
  //console.log("Arrays"+Arrays)
  let idProducto = Arrays.pdc_id || "no-one";
  let Nombre = Arrays.pdc_nombre || "no-one";
  let Imagen = Arrays.pdc_imagen || "no-one";
  let Seccion = Arrays.sec_nombre || "no-one";
  let Descripcion = Arrays.pdc_descripcion || "no-one";
  let Marca = Arrays.mar_nombre || "no-one";
  let Color = Arrays.col_nombre || "no-one";  
  let CantXs = Arrays.cant_xs || "0";
  let CantS = Arrays.cant_s || "0";
  let CantM = Arrays.cant_m || "0";
  let Cantl = Arrays.cant_l || "0";
  let Cantxl = Arrays.cant_xl || "0";
  let Valor = Arrays.pdc_valor || "0";

  let redirects = `description?Nombre=${Nombre}&&Imagen=${Imagen}&&Seccion=${Seccion}&&Descripcion=${Descripcion}&&Marca=${Marca}&&Color=${Color}&&CantXs=${CantXs}&&CantS=${CantS}&&CantM=${CantM}&&Cantl=${Cantl}&&Cantxl=${Cantxl}&&Valor=${Valor}&&idProducto=${idProducto}`;
  return res.status(200).send({status:200,message:"Ok",redirect:redirects})
}

async function getAllproducts(req, res, next) {
  const {connection,pool} = await getConnection();
   try {
 
     // Obtener los parámetros de paginación
     const currentPage = req.query.page || 1;
     //console.log("Current:"+currentPage)
     //console.log(req.query.search)
     const pageSize = req.query.length || 5;
     const offset = (currentPage - 1) * pageSize;
 
     // Obtener el número total de filas
     const totalCountQuery = 'SELECT COUNT(*) AS total FROM producto';
     const totalCountResult = await connection.query(totalCountQuery);
     const totalRows = totalCountResult[0][0].total;
     //
    let query;
    let busqueda = req.query.search;
    if (busqueda.value != ''){
      query = `SELECT * FROM producto WHERE CONCAT(pdc_nombre, ' ',pdc_imagen, ' ', pdc_fk_seccion, ' ', pdc_descripcion, ' ', pdc_fk_marca, ' ', pdc_fk_color, ' ',pdc_valor ) LIKE '%${busqueda.value}%'`;
    }else{
     // Obtener los resultados paginados
     query = `SELECT * FROM producto LIMIT ${offset}, ${pageSize}`;
     //FIN 
     } 
     const result = await connection.query(query);
     //console.log(result[0])
     // Calcular el número de páginas
     const totalPages = Math.ceil(totalRows / pageSize);
     // Retornar los resultados paginados y el número total de páginas como respuesta JSON
     res.json({
       data: result[0],
       recordsTotal: totalRows,
       recordsFiltered: totalRows,
       draw: req.query.draw,
       totalPages: totalPages
     });
     await pool.end()
   } catch (error) {
     await pool.end();
     console.error(error);
     res.status(500).send('Error al obtener los productos');
   }
 }

async function deleteProduct(req,res,next){
  const {connection,pool} = await getConnection();
  try{
    let id = req.body.id;
    //console.log("id"+id);
    let pdc_imagen = await connection.query(`SELECT pdc_imagen FROM producto WHERE pdc_id=${id}`);
    let url = (pdc_imagen[0][0].pdc_imagen);
    await connection.query(`DELETE FROM busquedas WHERE pdc_id=${id}`);
    const sql = await connection.query(`DELETE FROM producto WHERE pdc_id=${id}`);
    await fs.unlink(`app/assets/${url}`);
    return res.status(200).send({status:200,message:"Producto Eliminado",redirect:"/admin"});
  }catch(err){
    console.error(err);
    return res.status(400).send({status:400,message:"Error al Eliminar producto",redirect:"/admin"})
  }
  finally{
    console.log("Eliminar imagen cerrado")
    await pool.end();
  }
}

async function getEditProduct(req,res,next){
  const {connection,pool} = await getConnection();
  try{
  let id = req.body.id;
  console.log("ID:"+id);
  //let arr = [];
  const sql = await connection.query(`SELECT * FROM producto WHERE pdc_id=${id}`);
  let redirects;
  sql[0].forEach(arr =>{
  redirects = `/editproduct?Nombre=${arr.pdc_nombre}&&Imagen=${arr.pdc_imagen}&&Seccion=${arr.pdc_fk_seccion}&&Descripcion=${arr.pdc_descripcion}&&Marca=${arr.pdc_fk_marca}&&Color=${arr.pdc_fk_color}&&Valor=${arr.pdc_valor}&&Xs=${arr.cant_xs}&&S=${arr.cant_s}&&M=${arr.cant_m}&&L=${arr.cant_l}&&Xl=${arr.cant_xl}&&idProduct=${id}`;
  //console.log(arr.pdc_nombre)
  })
  await pool.end();
  return res.status(200).send({status:200,message:"Seleccion realizada",redirect:redirects})
  }catch(err){
    console.error(err);
  }
  /*finally{
    console.log("Edicion producto cerrada");
    await pool.end()
  }*/ 
}

export const methods ={
    InsertNewProduct,
    getProdListFromCategory,
    searchProdFromName,
    getProdForSearch,
    getProdDetail,
    getAllproducts,
    deleteProduct,
    getEditProduct,
    EditProduct
}