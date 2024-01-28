import { getConnection } from "../database/database.js";

async function getAllTipo(){
    const {connection,pool} = await getConnection();
    try{
        const sql = await connection.query('SELECT * FROM tipo_documento');
        const ArrayData = sql[0];
        //console.log(ArrayData)
        return ArrayData
    }catch(err){
        await pool.end();
        console.error(err);
    }
    finally{
        await pool.end();
        console.log("Tipo documento cerrado")
    }
} 

export const methods = {
    getAllTipo
}