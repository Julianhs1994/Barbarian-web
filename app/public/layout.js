
document.addEventListener("DOMContentLoaded",async () => {
  var elemento = document.getElementById("LogOut");
    if(elemento){
    elemento.addEventListener("click",async () => {
      const respuesta = await fetch("/api/close",{
        method:"POST",
        headers:{
            "Content-type": "application/json"
        },
      })
      if(respuesta.status != 200 && respuesta.status != 201){
        return 
      }else{
        const resJson = await respuesta.json();
        document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        if(resJson.redirect){
            window.location.href = resJson.redirect
        }
      }
    });
    }
});

async  function sendParametro(value){
  try{

    const response = await fetch("api/getSectionProd",{
      method:"POST",
      headers:{
        "Content-type":"application/json"
      },
      body:JSON.stringify({
        value:value
      })
    });
    if (response.status != 200 && response.status != 201){
      return
    }else{
      const responseJSON = await response.json();
      if(responseJSON.redirect){
        window.location.href=responseJSON.redirect;
      }
    } 

  }catch(err){
    console.error(err)
  }  
  
}

  document.getElementById("Man").addEventListener("click",async()=>{
    const parametro = "1"
    const result = await sendParametro(parametro)
    console.log("result",result)
  });

  document.getElementById("Woman").addEventListener("click",async()=>{
    const parametro = "2"
    const result = await sendParametro(parametro)
    console.log("result",result)
  })


//Buscador Js:


// Captura el evento de búsqueda

const searchInput = document.getElementById("SearchProd");
searchInput.addEventListener('input',async (event) =>{
  let query = "";
  query = event.target.value;
  //->Extraer el genero de la url
  const urlParams = new URLSearchParams(window.location.search);
  const myParam = urlParams.get('gender') || 1;
  //console.log(myParam)
  if(query==""){ //si la busqueda está vacia
    query = "%/%querty%/%" //quemar valor para limpiar div
  }
  const response = await fetch(`/search?query=${encodeURIComponent(query)}&&gender=${encodeURIComponent(myParam)}`,{
    method:"POST",
    headers:{
      "Content-type":"application/json"
    },
  })
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    //console.log("data:"+data.results);
    displayResults(data.results)
  } else {
    console.error('Error en la solicitud de búsqueda: La respuesta no es un JSON válido');
  }

})

// Función para mostrar los resultados en el recuadro debajo del buscador
function displayResults(results) {
  const resultsContainer = document.getElementById('recuadro');
  
  // Limpia los resultados anteriores
  resultsContainer.innerHTML = '';
  
  // Muestra los resultados en el recuadro
  results.forEach((result,index) => {
    const resultItem = document.createElement('div');
    const splitText = result.pdc_nombre.split('/');
    const desiredText = splitText[0].trim();
    resultItem.textContent = desiredText;//result.pdc_nombre;
    resultItem.setAttribute('id', `result-${index}`);
    resultsContainer.appendChild(resultItem);
    //cuando clcikea elementos del recuadro
    document.getElementById(`result-${index}`).addEventListener('click',(e)=>{
      let id = e.target.id
      //console.log(id);
      let texto = document.getElementById(id).innerHTML;//obtener el texto
      //console.log(texto)
      document.getElementById("SearchProd").value = texto//reemplaza el texto
      resultsContainer.innerHTML = ''; //lo encontró,borra los textos del recuadro
    });
  });
  //desplazarce por el recuadro
  let selectedResultIndex = -1; // Inicialmente ninguno está seleccionado
  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault(); // Evita el desplazamiento de la página por defecto
      selectedResultIndex++; // Incrementa el índice del resultado seleccionado
      let last = selectedResultIndex -1
      // Verifica si el índice está fuera de rango
      if (selectedResultIndex >= results.length) {
        selectedResultIndex = 0; // Vuelve al primer div si se alcanza el final
      }
      if (last >= 0){
        let div = document.getElementById(`result-${last}`);
        div.classList.remove("selected"); 
      }
      // Resalta el div seleccionado aplicando un estilo
      const selectedResult = document.getElementById(`result-${selectedResultIndex}`);
      selectedResult.classList.add('selected');
    }
  });
  document.addEventListener('keydown', (event) => {
    if(event.key === 'Enter'){
      //obtengo el div seleccionado y extraigo el texto
      let selectedDivText = document.getElementsByClassName('selected')[0].innerHTML;
      console.log(selectedDivText);
      document.getElementById("SearchProd").value = selectedDivText//reemplaza el texto
      resultsContainer.innerHTML = '';
    }
  }) 

}


//Boton buscador

document.getElementById('botonBuscar').addEventListener("click",async ()=>{
  const value = document.getElementById('SearchProd').value;
  //->Extraer el genero de la url
  const urlParams = new URLSearchParams(window.location.search);
  const myParam = urlParams.get('gender') || 1;
  //
  const respuesta = await fetch(`api/searchProdFromName?gender=${encodeURIComponent(myParam)}`,{
    method: "POST",
    headers:{
      'Content-type':"application/json"
    },
    body:JSON.stringify({
      value:value
    })
  });
  if(respuesta.status != 200 && respuesta.status != 201 ){
    return console.log(respuesta.status)
  }else{
    const respuestaJson = await respuesta.json();
    if(respuestaJson.redirect){
      window.location.href = respuestaJson.redirect;
    }
  }

})

//mostrarcarrito

async function eliminarProducto(nombre,talla){
  const response = await fetch("/eliminarProductoCarrito",{
    method:"POST",
    headers: {
      "Content-type":"application/json"
    },
    body:JSON.stringify({
      nombre:nombre,
      talla:talla
    })
  })
  const res = await response.json();
  if(res.status == 200){
    const length = res.length;
    document.getElementById('cantidadProductosEnCarrito').textContent = length;
  }
}

// Agrega un evento al ícono del carrito para mostrar la ventana emergente o recuadro al hacer clic
document.querySelector('.carts a').addEventListener('click', async () => {
  // Obtén los productos en el carrito desde la sesión del usuario
  const respuesta = await fetch('/obtenerProductos',{
    method:"POST",
    headers:{
      'Content-type':"application/json"
    },
  });
  if (respuesta.status != 200){
   return
  }else{
    const contentType = respuesta.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
    const data = await respuesta.json();
    
    // Actualiza el contenido de la ventana emergente o recuadro con los productos en el carrito
    const productList = document.getElementById('productosEnCarritoList');
    productList.innerHTML = '';
      //
      let suma = 0;
      data.productos.forEach(producto => {
      const li = document.createElement('li');
      suma = producto.valTot + suma;
      document.getElementById('total').value = suma;
      li.textContent = `${producto.nombre} - X:${producto.cantidad} talla: ${producto.talla}`;
       // Agregar un botón para eliminar el producto
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.addEventListener('click', () => {
        // Lógica para eliminar el producto, por ejemplo, llamando a una función para manejar la eliminación
        eliminarProducto(producto.nombre,producto.talla);
        // Eliminar el elemento de la lista visualmente
        li.remove();
      });
      li.appendChild(btnEliminar);
      productList.appendChild(li);
      
      });
    
    // Muestra la ventana emergente o recuadro
    document.getElementById('carritoPopup').style.display = 'block';
    } else {
      console.error('Error en la solicitud de búsqueda: La respuesta no es un JSON válido');
    }
  }
});

//->cerrar recuadro:

// Obtén una referencia al recuadro del carrito
const carritoPopup = document.getElementById('carritoPopup');

// Agrega un evento de clic al documento
document.addEventListener('click', (event) => {
  // Verifica si el clic ocurrió dentro del recuadro del carrito
  const targetElement = event.target;
  if (!carritoPopup.contains(targetElement)) {
    // El clic ocurrió fuera del recuadro del carrito, cierra el carrito
    carritoPopup.style.display = 'none';
  }
});

/*data.carrito.forEach(objeto => {
  let valor = objeto.valTot;
  console.log("valor:"+valor);
  document.getElementById('total').textContent = valor;
});*/

document.getElementById('pagar').addEventListener('click',async ()=> {
  const response = await fetch("api/sendMailPay",{
    method: "POST",
    headers:{
      "Content-type":"application/json"
    }

  });
  const res = await response.json();
  alert(res.message);
  if(res.status == 200){
    document.getElementById('cantidadProductosEnCarrito').textContent = 0;
  }
  
})