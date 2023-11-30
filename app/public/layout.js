
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("LogOut").addEventListener("click",async () => {
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
        //console.log("Url Ok");
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
  const query = event.target.value;
  const response = await fetch(`/search?query=${encodeURIComponent(query)}`,{
    method:"POST",
    headers:{
      "Content-type":"application/json"
    },
  })
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    console.log("data:"+data.results);
    displayResults(data.results)
  } else {
    console.error('Error en la solicitud de búsqueda: La respuesta no es un JSON válido');
  }

})

// Función para mostrar los resultados en el recuadro debajo del buscador
function displayResults(results) {
  const resultsContainer = document.getElementById('SearchProd');
  
  // Limpia los resultados anteriores
  resultsContainer.innerHTML = '';
  
  // Muestra los resultados en el recuadro
  results.forEach(result => {
    const resultItem = document.createElement('div');
    resultItem.textContent = result.pdc_nombre;
    resultsContainer.appendChild(resultItem);
  });
}
