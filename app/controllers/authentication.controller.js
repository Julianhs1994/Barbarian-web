import bcryptjs from "bcryptjs";
//import { json } from "express";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const usuarios = [{
    user:"aa",
    email:"aa",
    //user pass: aasd
    password:'$2a$05$fGacgfn9WJhn9974ScMEHubzxEFFH.N3XXwNuvAi1meg4PkwULP.m'
}]

async function login(req,res){
    console.log(req.body);
    const user = req.body.user;
    const password = req.body.password;
    if (!user || !password){
        return res.status(400).send({
            status:400,
            message:'campos incompletos'
        })
    }
    const usuarioArevisar = usuarios.find(usuario => usuario.user === user);
    if(!usuarioArevisar){
        return res.status(400).send({
            status:400,
            message:'Error/Problema con el usuario'
        })
    }
    //comparar contraseñas
    const loginCorrecto = await bcryptjs.compare(password,usuarioArevisar.password);
    console.log(loginCorrecto);
    if(!loginCorrecto){
        return res.status(400).send({
            status:400,
            message:'Error al logear'
        });
    }
    //Token de autenticacion
    const token = jsonwebtoken.sign({
        user:usuarioArevisar.user},
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRES}
        )
    
    const cookieOption = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES *24 *60 *60 *1000),
        Path:"/"
    }    
    res.cookie('jwt',token,cookieOption);
    res.status(200);
    res.send({status:"Ok",message:"Usuario logeado",redirect:"/"})


}

async function register(req,res){
    console.log(req.body);
    const user = req.body.user;
    const email = req.body.email;
    const password = req.body.password;
    if(!user || !email || !password){
        return res.status(400).send({status:400,message:'campos incompletos'})
    }
    const usuarioArevisar = usuarios.find(usuario=>usuario.user === user)
    if(usuarioArevisar){
        return res.status(400).send({status:'Error',message:'este usuario ya existe'})
    }
    const salt = await bcryptjs.genSalt(5);
    const hashPasword = await bcryptjs.hash(password,salt);

    const nuevoUsuario = {
        user,email,password:hashPasword,
    }

    console.log(nuevoUsuario);
    usuarios.push(nuevoUsuario);
    return res.status(201).send({status:'Ok',message:`Usuario agregado ${nuevoUsuario.user}`,redirect:"/"})

}

export const methods = {
    login,
    register,
}