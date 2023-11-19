import { getConnection } from "../database/database.js";

async function InsertNewProduct(pdc_fk_seccion,pdc_descripcion,pdc_fk_marca,pdc_fk_color,cant_xs,cant_s,cant_m,cant_l,cant_xl,pdc_valor,pdc_imagen){
    const connection = await getConnection();
    let pdc_estado = 1;
    const sql = 'INSERT INTO producto (pdc_fk_seccion,pdc_descripcion,pdc_fk_marca,pdc_fk_color,cant_xs,cant_s,cant_m,cant_l,cant_xl,pdc_valor,pdc_imagen,pdc_estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(sql, [pdc_fk_seccion,pdc_descripcion,pdc_fk_marca,pdc_fk_color,cant_xs,cant_s,cant_m,cant_l,cant_xl,pdc_valor,pdc_imagen,pdc_estado], (error, results) => {
      if (error) {
        reject(error)
      } else {
        console.log('Producto guardado con éxito');
        resolve('Producto guardado con éxito');
      }
    });
  }

async function getProdListFromCategory(req,res,next){
  try{
    const page = req.body.page || 1; // Página 
    //console.log("BODY-body:" , req.body.page);
    //console.log("BODY-query:" , req.query.page);
    const pageSize = req.body.pageSize || 3; // Tamaño de página deseado
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
    return res.status(201).send({
      status:"Ok",
      message:"Resultado Exitoso",
      redirect:"/",
      arrayData:arrayData,
      page:page,
      totalPages: totalPages,
      pageSize: pageSize,
      //
      gender:value
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