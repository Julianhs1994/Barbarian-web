
async  function sendParametros(value,page,pageSize){
    try{
        alert(page);
        console.log("PAGEJS:",page)
  
      const response = await fetch("api/getSectionProd",{
        method:"POST",
        headers:{
          "Content-type":"application/json"
        },
        body:JSON.stringify({
          value:value,
          page: page,
          pageSize:pageSize

        })
        
      });
      if (response.status != 200 && response.status != 201){
        return console.log(response.status)
      }else{
        const responseJSON = await response.json();
        if(responseJSON.redirect){
          window.location.href= responseJSON.redirect;
        }
      } 
  
    }catch(err){
      console.error(err)
    }  
    
  }
  

document.querySelectorAll('.my-link').forEach(async function(link) {
    link.addEventListener('click',async function(event) {
      event.preventDefault(); // Evita que el navegador siga el enlace
  
      var value = this.dataset.gender;
      var page = this.dataset.page;
      var pageSize = this.dataset.pageSize;
     
  
      // Realiza las acciones necesarias con los valores de page y pageSize
      console.log("pageX:", page);
      console.log("pageSizeX-:", pageSize);
      //envia los datos
      const res = await sendParametros(value,page,pageSize)
    });
  });


//->redirect register
const button = document.getElementById('buttonRedirect');
if(button){
button.addEventListener('click',()=>{
  window.location.href = 'login'
});
}  

//->redirect detalle
const buttonV = document.getElementById('buttonDetalle');
if(buttonV){
buttonV.addEventListener('click',async ()=>{
  let value = buttonV.value;
  console.log("value:",value)

  const response = await fetch("api/description",{
    method: "POST",
    headers:{
      "Content-type":"application/json"
    },
    body:JSON.stringify({
      value:value
    })
  });
  if(response.status != 200){
    return
  }else{
    const responseJSON = await response.json();
    if(responseJSON.redirect){
      window.location.href = responseJSON.redirect;
    }
  }
})
}