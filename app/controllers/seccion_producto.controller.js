import { getConnection } from "../database/database.js";

async function getAllSeccion_Producto(){
    const {connection,pool} = await getConnection();
    try{
        const sql = await connection.query('SELECT * FROM seccion_producto');
        const ArrayData = sql[0];
        return ArrayData
    }catch(err){
        await pool.end();
        console.error(err);
    }
    finally{
        await pool.end();
    }
} 

export const methods = {
    getAllSeccion_Producto
}