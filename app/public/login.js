document.getElementById('login-form').addEventListener('submit',async (e)=>{
    e.preventDefault();
    const user = e.target.children.user.value;
    const password = e.target.children.password.value;
    const respuesta = await fetch('http://localhost:8080/api/login',{
        method:"POST",
        headers:
        {
            "Content-type":"application/json"
        },
        body:JSON.stringify({
            user:user,
            password:password
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