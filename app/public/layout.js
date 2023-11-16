/*document.getElementsByTagName('button')[0].addEventListener("click",()=>{
    document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.location.href = "/"
})*/

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("LogOut").addEventListener("click",async () => {
      //console.log("clicked");
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
        const arrayData = responseJSON.arrayData;
        const encodedArrayData = decodeURIComponent(JSON.stringify(arrayData));
        const redirectUrl = ""+responseJSON.redirect+"?value="+encodedArrayData//`${response.redirect}?value=${encodedArrayData}`;
        window.location.href=redirectUrl;
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
