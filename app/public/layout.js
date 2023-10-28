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