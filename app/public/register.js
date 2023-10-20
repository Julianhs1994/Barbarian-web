document.getElementById('register-form').addEventListener('submit',async (e)=>{
    e.preventDefault();
    //console.log("llegando...");
    let nombre = (e.target.children[0].children[1].value);
    let apellido =  (e.target.children[1].children[1].value);
    let tipoDocumento = (e.target.children[2].children[1].value);
    let numeroDocumento = (e.target.children[3].children[1].value);
    //console.log("Dato de prueba:",numeroDocumento);
    let email = (e.target.children[4].children[1].value);
    let contrasenia = (e.target.children[5].children[1].value);
    const respuesta = await fetch("https://barbarian-web-koqc.vercel.app/api/register",{
        method: "post",
        headers:{
            "Content-type":"application/json"
        },
        body: JSON.stringify({
            /*user:user,
            email:email,
            password:password*/
            usr_tipo_documento:tipoDocumento,
            usr_numero_documento:numeroDocumento,
            usr_nombre:nombre,
            usr_apellido:apellido,
            usr_email:email,
            usr_contrasenia:contrasenia,
        }),

    });
    //console.log(respuesta.Ok);
    //console.log(respuesta.status);
    if(respuesta.status != 201 && respuesta.status != 200){
        return
    }else{
        //lectura del json del body
        const resJson = await respuesta.json();
        if(resJson.redirect){
            window.location.href = resJson.redirect;
        }

    }

})







