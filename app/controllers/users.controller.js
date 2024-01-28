import { getConnection } from "../database/database.js";


async function getAllUsers(req, res, next) {
  const {connection,pool} = await getConnection();
   try {
 
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
     // Retornar los resultados paginados y el número total de páginas como respuesta JSON
     res.json({
       data: result[0],
       recordsTotal: totalRows,
       recordsFiltered: totalRows,
       draw: req.query.draw,
       totalPages: totalPages
     });
     await pool.end()
   } catch (error) {
     await pool.end();
     console.error(error);
     res.status(500).send('Error al obtener los usuarios');
   }
   /*finally{
    await pool.end();
    console.log('obtener todos los usuarios finalizado');
   }*/
 }

 async function deleteUser(req,res,next){
  const {connection,pool} = await getConnection();
  try{
    let id = req.body.id;
    //console.log("id"+id);
    const sql = await connection.query(`DELETE FROM usuario WHERE usr_id=${id}`);
    return res.status(200).send({status:200,message:"usuario Eliminado",redirect:"/admin"});
  }catch(err){
    console.error(err);
    return res.status(400).send({status:400,message:"Error al Eliminar usuario",redirect:"/admin"})
  }
  finally{
    console.log("Eliminar imagen cerrado")
    await pool.end();
  }
}

async function getEditUser(req,res,next){
  const {connection,pool} = await getConnection();
  try{
  let id = req.body.id;
  const sql = await connection.query(`SELECT * FROM usuario WHERE usr_id=${id}`);
  let redirects;
  sql[0].forEach(arr =>{
  redirects = `/edituser?Rol=${arr.usr_rol}&&TipoDocumento=${arr.usr_tipo_documento}&&NumeroDocumento=${arr.usr_numero_documento}&&Nombre=${arr.usr_nombre}&&Apellido=${arr.usr_apellido}&&Email=${arr.usr_email}&&Estado=${arr.usr_estado}&&idUser=${arr.usr_id}`;
  })

  return res.status(200).send({status:200,message:"Seleccion realizada",redirect:redirects})
  }catch(err){
    console.error(err);
  }
  finally{
    console.log("Edicion Usuario cerrada");
    await pool.end()
  } 
}

//->Editar usuario existente:
async function EditUser(idUser,usr_rol,usr_tipo_documento,usr_numero_documento,usr_nombre,usr_apellido,usr_email,usr_estado){

  console.log("isd: "+idUser)
  /*console.log("rol: "+usr_rol)
  console.log("tipo: "+usr_tipo_documento)
  console.log("numero: "+usr_numero_documento)
  console.log("nombre: "+usr_nombre)
  console.log("apellido: "+usr_apellido)
  console.log("email: "+usr_email)
  console.log("estado: "+usr_estado)*/

  if(!idUser || !usr_rol || !usr_tipo_documento || !usr_numero_documento || !usr_nombre || !usr_apellido || !usr_email || !usr_estado ){
    console.log("un elemento está vacio")
    return ({boolean:false})
  }
  const {connection,pool} = await getConnection();
  try{
    let usr_id = idUser;
    const sql = 'UPDATE usuario SET usr_rol = ?, usr_tipo_documento = ?, usr_numero_documento = ?, usr_nombre = ?,usr_apellido = ?,usr_email = ?,usr_estado = ? WHERE usr_id = ?';
    connection.query(sql, [usr_rol,usr_tipo_documento,usr_numero_documento,usr_nombre,usr_apellido,usr_email,usr_estado,usr_id]);
    return ({boolean:true});
  }catch(err){
    console.error(err)
    await pool.end();
    return ({boolean:true})
  }
  finally {
    await pool.end();
    console.log('editar usuario finalizado')
  }  
}

 
 export const methods ={
    getAllUsers,
    deleteUser,
    getEditUser,
    EditUser
}