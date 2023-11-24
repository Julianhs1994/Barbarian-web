//import { methods as cryptoMethods } from "../public/cryptos.js";
/*
const algorithm = 'aes-256-cbc';
const key = process.env.ENCODE_URL; // clave secreta

function encryptUrl(url) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  
    let encrypted = cipher.update(url, 'utf8', 'hex');
    encrypted += cipher.final('hex');
  
    return `${iv.toString('hex')}:${encrypted}`;
  }
  
function decryptUrl(encryptedUrl) {
    const [iv, encryptedText] = encryptedUrl.split(':');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), Buffer.from(iv, 'hex'));
  
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
  
    return decrypted;
}
*/

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
        /*const arrayData = responseJSON.arrayData;
        const encodedArrayData = decodeURIComponent(JSON.stringify(arrayData));
        const page = responseJSON.page;
        const totalPages = responseJSON.totalPages;
        const pageSize = responseJSON.pageSize;
        const redirectUrl = responseJSON.redirect + "?value=" + encodedArrayData + "&page=" + page + "&totalPages="+totalPages + "&pageSize="+ pageSize +"&gender="+value ;
        //const url = /*cryptoMethods.*///encryptUrl(redirectUrl);
        console.log("Url Ok");
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
