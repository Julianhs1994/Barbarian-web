//Agregar productos al carrito
document.getElementById("carritoButton").addEventListener('click',async () =>{
    const currentUrl = window.location.search;
    // Crear un objeto URLSearchParams
    const urlParams = new URLSearchParams(currentUrl); // Obtener los parámetros de la URL actual que se encuentran después del símbolo '?' y los almacena en un objeto URLSearchParams
    const nombreEscapado = urlParams.get('Nombre'); // Obtener el valor del parámetro 'Nombre' escapado
    const nombre = decodeURIComponent(nombreEscapado); // Decodificar el valor del parámetro 'Nombre' escapado para obtener el valor original del parámetro 'Nombre'
    const idProducto = urlParams.get('idProducto'); // Obtener el valor del parámetro 'idProducto' sin escapar los espacios en blanco

    let cantidad = document.getElementById('numero').value;

    const respuesta = await fetch(`/agregar-al-carrito/${idProducto}/${cantidad}/${nombre}`,{
        method:"POST",
        headers:{
            "Content-type":"application/json",
        },
    });
    if(respuesta.status != 200 ){
        return
    }else{
        //agregar cantidad de productos al icono
        const contentType = respuesta.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
            const data = await respuesta.json();
            const length = data.carrito.length;
            document.getElementById('cantidadProductosEnCarrito').textContent = length;
            //window.location.href = "/"
        } else {
            console.error('Error en la solicitud de búsqueda: La respuesta no es un JSON válido');
        }
    }
})

