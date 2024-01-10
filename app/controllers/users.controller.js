import { getConnection,closeConnection } from "../database/database.js";


async function getAllUsers(req, res, next) {
   try {
     const connection = await getConnection();
 
     // Obtener los parámetros de paginación
     const currentPage = req.query.page || 1;
     console.log("Current:"+currentPage)
     //console.log(req.query.search)
     const pageSize = req.query.length || 5;
     const offset = (currentPage - 1) * pageSize;
 
     // Obtener el número total de filas
     const totalCountQuery = 'SELECT COUNT(*) AS total FROM usuario';
     const totalCountResult = await connection.query(totalCountQuery);
     const totalRows = totalCountResult[0][0].total;
     //PRUEBA
    let query;
    let busqueda = req.query.search;
    if (busqueda.value != ''){
      query = `SELECT * FROM usuario WHERE CONCAT(usr_rol, ' ', usr_tipo_documento, ' ', usr_numero_documento, ' ', usr_nombre, ' ', usr_apellido, ' ',usr_email ) LIKE '%${busqueda.value}%'`;
    }else{
 
     // Obtener los resultados paginados
     query = `SELECT * FROM usuario LIMIT ${offset}, ${pageSize}`;
     
     //FIN PRUEBA
     } 
     const result = await connection.query(query);
     console.log(result[0])
     // Calcular el número de páginas
     const totalPages = Math.ceil(totalRows / pageSize);
     await closeConnection();
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