import { getConnection } from "../database/database.js";

async function getAllcolor_producto(){
    const {connection,pool} = await getConnection();
    try{
        const sql = await connection.query("SELECT * FROM color_producto");
        const ArrayData = sql[0];
        return ArrayData;
    }catch(err){
        await pool.end();
        console.error(err)
    }
    finally {
        await pool.end();
        console.log('color de producto finalizado')
    };
}

export const methods = {
    getAllcolor_producto
}