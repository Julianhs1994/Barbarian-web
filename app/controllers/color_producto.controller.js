import { getConnection } from "../database/database.js";

async function getAllcolor_producto(){
    try{
        const connection = await getConnection();
        const sql = await connection.query("SELECT * FROM color_producto");
        const ArrayData = sql[0];
        await closeConnection();
        return ArrayData;
    }catch(err){
        await closeConnection();
        console.error(err)
    }
}

export const methods = {
    getAllcolor_producto
}