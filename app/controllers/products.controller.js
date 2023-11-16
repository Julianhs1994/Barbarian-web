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

    if(!req.session){
      req.session = {}
    }
    const connection = await getConnection();
    const value = req.body.value;
    const result = await connection.query("SELECT * FROM producto WHERE pdc_fk_seccion=?",[value]);
    const arrayData = result[0];
    return res.status(201).send({
      status:"Ok",
      message:"Resultado Exitoso",
      redirect:"/",
      arrayData:arrayData
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