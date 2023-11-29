import { getConnection } from "../database/database.js";
let cachedProductNames = [];

// Función para obtener los nombres de los productos desde la base de datos y almacenarlos en caché
async function cacheProductNames() {
  try {
    const connection = await getConnection();
    const productNames = await connection.query('SELECT pdc_nombre FROM producto');
    // Almacena los nombres de los productos en caché
    //console.log(productNames[0])
    cachedProductNames = productNames[0];//productNames.map(product => product.nombre);
    console.log(cachedProductNames)
  } catch (error) {
    console.error('Error al obtener los nombres de los productos desde la base de datos:', error);
  }
}

// Llama a la función para almacenar en caché los nombres de los productos cuando el servidor se inicie
cacheProductNames();

// Función para buscar productos en base a un término de búsqueda
// Exporta la función de búsqueda para que pueda ser utilizada en otros módulos
export function searchProducts(query) {
    // Filtra los nombres de los productos almacenados en caché en base al término de búsqueda
    const filteredProducts = cachedProductNames.filter((product) =>
    product.pdc_nombre.toLowerCase().includes(query.toLowerCase())
  );
    console.log(filteredProducts)
  
    return filteredProducts;
  }