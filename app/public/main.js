

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
          page: page,//parseInt(page), 
          pageSize:pageSize

        })
        
      });
      if (response.status != 200 && response.status != 201){
        return console.log(response.status)
      }else{
        const responseJSON = await response.json();
        if(responseJSON.redirect){
          const arrayData = responseJSON.arrayData;
          const encodedArrayData = decodeURIComponent(JSON.stringify(arrayData));
          //const page = responseJSON.page;
          const totalPages = responseJSON.totalPages;
          const pageSize = responseJSON.pageSize;
          console.log("thepage:"+page)
          //const redirectUrl = ""+responseJSON.redirect+"?value="+encodedArrayData+"&page="+page//`${response.redirect}?value=${encodedArrayData}`;
          const redirectUrl = responseJSON.redirect + "?value=" + encodedArrayData + "&page=" + page + "&totalPages="+totalPages + "&pageSize="+ pageSize ;
          window.location.href=redirectUrl;
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

  