//Agregar productos al carrito
document.getElementById("carritoButton").addEventListener('click',async () =>{
    const currentUrl = window.location.search;
    // Crear un objeto URLSearchParams
    const urlParams = new URLSearchParams(currentUrl); // Obtener los parámetros de la URL actual que se encuentran después del símbolo '?' y los almacena en un objeto URLSearchParams
    const nombreEscapado = urlParams.get('Nombre'); // Obtener el valor del parámetro 'Nombre' escapado
    const nombre = decodeURIComponent(nombreEscapado); // Decodificar el valor del parámetro 'Nombre' escapado para obtener el valor original del parámetro 'Nombre'
    const idProducto = urlParams.get('idProducto'); // Obtener el valor del parámetro 'idProducto' sin escapar los espacios en blanco
    const talla = document.getElementById("talla").value;

    let cantidad = document.getElementById('numero').value;

    const precio = urlParams.get('Valor')

    const respuesta = await fetch(`/agregar-al-carrito/${idProducto}/${cantidad}/${nombre}/${talla}/${precio}`,{
        method:"POST",
        headers:{
            "Content-type":"application/json",
        },
    });
    if(respuesta.status != 200 ){
        const res = await respuesta.json();
        alert(res.message);
        return
    }else{
        //agregar cantidad de productos al carrito
        const contentType = respuesta.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
            const data = await respuesta.json();
            const length = data.carrito.length;
           
            console.log("data"+data.carrito)
            document.getElementById('cantidadProductosEnCarrito').textContent = length;
            //window.location.href = "/"
        } else {
            console.error('Error en la solicitud de búsqueda: La respuesta no es un JSON válido');
        }
    }
})

//->no negativos en campo cantidad:
const inputNumero = document.getElementById('numero');

inputNumero.addEventListener('input', function() {
  if (this.value <= 0) {
    this.value = 1;
  }
});
