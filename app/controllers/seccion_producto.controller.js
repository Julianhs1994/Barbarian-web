import { getConnection } from "../database/database.js";

async function getAllSeccion_Producto(){
    try{
        const connection = await getConnection();
        const sql = await connection.query('SELECT * FROM seccion_producto');
        const ArrayData = sql[0];
        //console.log(ArrayData)
        return ArrayData
    }catch(err){
        console.error(err);
    }
} 

export const methods = {
    getAllSeccion_Producto
}