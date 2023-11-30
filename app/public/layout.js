
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
  let query = "";
  query = event.target.value;

  if(query==""){ //si la busqueda está vacia
    query = "%/%querty%/%" //quemar valor para limpiar div
  }
  const response = await fetch(`/search?query=${encodeURIComponent(query)}`,{
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
    resultItem.textContent = result.pdc_nombre;
    resultItem.setAttribute('id', `result-${index}`);
    resultsContainer.appendChild(resultItem);
    //
    document.getElementById(`result-${index}`).addEventListener('click',(e)=>{
      let id = e.target.id
      console.log(id);
      let texto = document.getElementById(id).innerHTML;//obtener el texto
      console.log(texto)
      document.getElementById("SearchProd").value = texto//reemplaza el texto
      resultsContainer.innerHTML = ''; //lo encontró,borra los textos
    });
  });
}

