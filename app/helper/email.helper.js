import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "storebarbarian30@gmail.com", //"cuenta para enviar los correos",
    pass: "tbiq wigy bfvx ahzq", //"Contraseña para aplicaciones del correo",
  },
});

const sendActivationEmail = async (userEmail, activationLink) => {
  try {
    const mailOptions = {
      from: "storebarbarian30@gmail.com", //"cuenta para enviar los correos",
      to: userEmail,
      subject: "Activación de cuenta",
      text: `Haz clic en el siguiente enlace para activar tu cuenta: ${activationLink}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("correo enviado");
  } catch (error) {
    console.error("Error al enviar el correo de activación:", error);
  }
};

/*const sendAmountEmail = async (userEmail,object) =>{
  try{
    const mailOptions = {
      from: "storebarbarian30@gmail.com",
      to: userEmail,
      subject: "Compra realizada Barbarian-Web Team",
      text: ""
    };
  }catch(err){
    console.log(err)
  }
}*/

const sendAmountEmail = async (userEmail, carrito) => {
  try {
    let texto = "Detalles de la compra:\n";

    carrito.forEach((producto) => {
      texto += `Nombre: ${producto.nombre}\nCantidad: ${producto.cantidad}\nTalla: ${producto.talla}\nValor Total: ${producto.valTot}\n\n`;
    });

    const mailOptions = {
      from: "storebarbarian30@gmail.com",
      to: userEmail,
      subject: "Compra realizada Barbarian-Web Team",
      text: texto,
    };
    // Aquí 
    await transporter.sendMail(mailOptions);
    console.log("Correo compra ha sido confirmado")
  } catch (err) {
    console.log(err);
    console.log("No se pudo enviar el correo compra")
  }
};


export { sendActivationEmail,sendAmountEmail };


