document.getElementById('login-form').addEventListener('submit',async (e)=>{
    e.preventDefault();
    const user = e.target.children[0].children.usr_email.value;
    const password = e.target.children[1].children.usr_contrasenia.value;
    //console.log(user||'negativo');
    //console.log(password||'negativo');
    const respuesta = await fetch('/api/login',{
        method:"POST",
        headers:
        {
            "Content-type":"application/json"
        },
        body:JSON.stringify({
            usr_email:user,
            usr_contrasenia:password
        })

    });
    if(respuesta.status != 201 && respuesta.status != 200){
        return
    }else{
        const resJson = await respuesta.json();
        if(resJson.redirect){
            window.location.href = resJson.redirect
        }
    }
})