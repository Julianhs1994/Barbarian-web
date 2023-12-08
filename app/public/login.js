//import { cryptoData } from "../crypto-client/crypto.js";

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = e.target.children[0].children.usr_email.value;
  const password = e.target.children[1].children.usr_contrasenia.value;
  const parametro = JSON.stringify({user,password});
  const forPost = "login";
  cryptoData(parametro,forPost)
 
});
