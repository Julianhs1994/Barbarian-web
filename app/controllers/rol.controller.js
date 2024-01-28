import { getConnection } from "../database/database.js";

async function getAllRol(){
    const {connection,pool} = await getConnection();
    try{
        const sql = await connection.query('SELECT * FROM rol');
        const ArrayData = sql[0];
        //console.log(ArrayData)
        return ArrayData
    }catch(err){
        await pool.end();
        console.error(err);
    }
    finally{
        await pool.end();
        console.log("Rol usuario cerrado")
    }
} 

export const methods = {
    getAllRol
}