import { getConnection } from "../database/database.js";

async function getAllmarca_producto(){
    try{
        const connection = await getConnection();
        const sql = await connection.query("SELECT * FROM marca_producto");
        const ArrayData = sql[0];
        await closeConnection();
        return ArrayData;
    }catch(err){
        await closeConnection();
        console.error(err)
    }
}

export const methods = {
    getAllmarca_producto
}