import { getConnection,closeConnection } from "../database/database.js";
let cachedProductNames = [];

// Función para obtener los nombres de los productos desde la base de datos y almacenarlos en caché
async function cacheProductNames() {
  try {
    const connection = await getConnection();
    //->obtener la lista de los productos con nombre y color
    const productNames = await connection.query(`SELECT producto.pdc_nombre, marca.mar_nombre, color.col_nombre, producto.pdc_fk_seccion
    FROM producto
    INNER JOIN marca_producto marca ON producto.pdc_fk_marca = marca.mar_id
    INNER JOIN color_producto color ON producto.pdc_fk_color = color.col_id 
`   );

    const allData = [];
    let string;
    //->metemos la consulta en otro array con texto en vez de objeto en sí
    productNames[0].forEach( (product,index) => {
      string = product.pdc_nombre+"/"+product.mar_nombre+" "+product.col_nombre+" "+product.pdc_fk_seccion;
      allData[index] = {pdc_nombre:string,pdc_fk_seccion:product.pdc_fk_seccion};
      //console.log("string["+index+"]:"+string)
    });
    //-> Almacena los nombres de los productos en caché
    cachedProductNames = allData; //productNames[0];//productNames.map(product => product.nombre);
    //console.log("Cached"+cachedProductNames)
  } catch (error) {
    await closeConnection();
    console.error('Error al obtener los nombres de los productos desde la base de datos:', error);
  }
  await closeConnection();
}

// Llama a la función para almacenar en caché los nombres de los productos cuando el servidor se inicie
cacheProductNames();

// Función para buscar productos en base a un término de búsqueda
// Exporta la función de búsqueda para que pueda ser utilizada en otros módulos
export function searchProducts(query,gender) {
    // Filtra los nombres de los productos almacenados en caché en base al término de búsqueda
    const filteredProducts = cachedProductNames.filter((product) =>
    {
      //console.log(product.pdc_nombre)
      if(product.pdc_fk_seccion.toString()==gender.toString()){
        return product.pdc_nombre.toLowerCase().includes(query.toLowerCase()) 
      }
    }
  );
    console.log(filteredProducts)
  
    return filteredProducts;
  }

  