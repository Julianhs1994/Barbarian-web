document.getElementById("carritoButton").addEventListener('click',async () =>{
    const currentUrl = window.location.href;
    // Crear un objeto URLSearchParams
    const urlParams = new URLSearchParams(currentUrl);
    // Obtener el valor del parámetro idProducto
    let idProducto = urlParams.get('idProducto');
    const respuesta = await fetch(`/agregar-al-carrito/${idProducto}/${cantidad}`,{
        method:"POST",
        headers:{
            "Content-type":"application/json",
        },
    });
    if(respuesta.status != 200 && respuesta.status != 200){
        return
    }else{
        window.location.href = "/"
    }
})