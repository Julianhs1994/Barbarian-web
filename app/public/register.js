document.getElementById('register-form').addEventListener('submit',async (e)=>{
    e.preventDefault();
    //console.log(e.target.children.user.value);
    let user = e.target.children.user.value;
    let email = e.target.children.email.value;
    let password = e.target.children.password.value;
    const respuesta = await fetch("http://localhost:8080/api/register",{
        method: "post",
        headers:{
            "Content-type":"application/json"
        },
        body: JSON.stringify({
            user:user,
            email:email,
            password:password
        }),

    });
    //console.log(respuesta.Ok);
    //console.log(respuesta.status);
    if(respuesta.status != 201){
        return
    }else{
        //lectura del json del body
        const resJson = await respuesta.json();
        if(resJson.redirect){
            window.location.href = resJson.redirect;
        }

    }

})