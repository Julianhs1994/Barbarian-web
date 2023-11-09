import { getConnection } from "../database/database.js";

/*async function getAllUsers(){
    const connection = await getConnection();
    const result = await connection.query("SELECT * FROM usuario");
    console.log(result)
    return result[0];
}
*/

/*async function getAllUsers(req,res,next){
    try {
       const connection = await getConnection();
       const result = await connection.query("SELECT * FROM usuario");
       //console.log(result);
       res.json(result[0]);
       console.log("resGetAll:"+res.json(result[0]))
    } catch (error) {
       // Manejar errores aquí
       console.error(error);
       res.status(500).send('Error al obtener los usuarios');
    }
 }*/

 /*async function getAllUsers(req, res, next) {
   try {
     const connection = await getConnection();
     const result = await connection.query("SELECT * FROM usuario");
     
     // Obtener el número total de filas
     const totalRows = result[0].length;
     
     // Obtener el número de página actual
     const currentPage = req.query.page || 1;
     const pageSize = 4;
     
     // Calcular el offset en base al número de página actual
     const offset = (currentPage - 1) * pageSize;
     
     // Obtener los resultados paginados
     const paginatedResult = result[0].slice(offset, offset + pageSize);
     
     // Calcular el número de páginas
     const totalPages = Math.ceil(totalRows / pageSize);
     
     // Retornar los resultados paginados y el número total de páginas como respuesta JSON
     res.json({
       data: paginatedResult,
       recordsTotal: totalRows,
       recordsFiltered: totalRows,
       draw: req.query.draw,
       totalPages: totalPages
     });
   } catch (error) {
     console.error(error);
     res.status(500).send('Error al obtener los usuarios');
   }
 }
*/

async function getAllUsers(req, res, next) {
   try {
     const connection = await getConnection();
 
     // Obtener los parámetros de paginación
     const currentPage = req.query.page || 1;
     const pageSize = 4;
     const offset = (currentPage - 1) * pageSize;
 
     // Obtener el número total de filas
     const totalCountQuery = 'SELECT COUNT(*) AS total FROM usuario';
     const totalCountResult = await connection.query(totalCountQuery);
     const totalRows = totalCountResult[0][0].total;
 
     // Obtener los resultados paginados
     const query = `SELECT * FROM usuario LIMIT ${offset}, ${pageSize}`;
     const result = await connection.query(query);
 
     // Calcular el número de páginas
     const totalPages = Math.ceil(totalRows / pageSize);
 
     // Retornar los resultados paginados y el número total de páginas como respuesta JSON
     res.json({
       data: result[0],
       recordsTotal: totalRows,
       recordsFiltered: totalRows,
       draw: req.query.draw,
       totalPages: totalPages
     });
   } catch (error) {
     console.error(error);
     res.status(500).send('Error al obtener los usuarios');
   }
 }
 
 export const methods ={
    getAllUsers
}