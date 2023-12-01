import { getConnection } from "../database/database.js";
import { methodsEnc } from "../crypto/cryptos.js";

async function InsertNewProduct(pdc_nombre,pdc_fk_seccion,pdc_descripcion,pdc_fk_marca,pdc_fk_color,cant_xs,cant_s,cant_m,cant_l,cant_xl,pdc_valor,pdc_imagen){

  if(!pdc_nombre || !pdc_fk_seccion || !pdc_descripcion || !pdc_fk_marca || !pdc_fk_color || !cant_xs || !cant_s || !cant_m || !cant_l || !cant_xl || !pdc_valor || !pdc_imagen || pdc_imagen == ""){
    console.log("enter")
    return ({boolean:false})
  }
  try{
    const connection = await getConnection();
    let pdc_estado = 1;
    const sql = 'INSERT INTO producto (pdc_nombre,pdc_fk_seccion,pdc_descripcion,pdc_fk_marca,pdc_fk_color,cant_xs,cant_s,cant_m,cant_l,cant_xl,pdc_valor,pdc_imagen,pdc_estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(sql, [pdc_nombre,parseInt(pdc_fk_seccion),pdc_descripcion,parseInt(pdc_fk_marca),parseInt(pdc_fk_color),cant_xs,cant_s,cant_m,cant_l,cant_xl,pdc_valor,pdc_imagen,pdc_estado]);
    return ({boolean:true});
  }catch(err){
    console.error(err)
    return ({boolean:true})
  }  
}

  
async function getProdListFromCategory(req,res,next){
  try{
    const page = req.body.page || 1; // Página 
    const pageSize = req.body.pageSize ||5
    ; // Tamaño de página deseado
    const value = req.body.value;
  
    if(!req.session){
      req.session = {}
    }
    // Ajusta tu consulta SQL para obtener solo los productos de la página actual
    const offset = (page - 1) * pageSize;
    const connection = await getConnection();
    const query = "SELECT * FROM producto WHERE pdc_fk_seccion=? LIMIT ? OFFSET ?";
    const result = await connection.query(query, [value, pageSize, offset]);
    const arrayData = result[0];
    //
    const totalCount = await connection.query("SELECT COUNT(*) as total FROM producto WHERE pdc_fk_seccion=?", [value]);
    const totalItems = totalCount[0][0].total;
    const totalPages = Math.ceil(totalItems / pageSize);
    //
    //const arrayData = responseJSON.arrayData;
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

}  

export const methods ={
    InsertNewProduct,
    getProdListFromCategory
}