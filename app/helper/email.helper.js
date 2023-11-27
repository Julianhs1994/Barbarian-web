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

export { sendActivationEmail };


