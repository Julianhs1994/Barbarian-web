/*import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "storebarbarian30@gmail.com", //"cuenta para enviar los correos",
    pass: "tbiq wigy bfvx ahzq", //"Contraseña para aplicaciones del correo",
  },
});

const sendActivationEmail = async (userEmail, activationLink, link2) => {
  try {
    const mailOptions = {
      from: "storebarbarian30@gmail.com", //"cuenta para enviar los correos",
      to: userEmail,
      subject: "Activación de cuenta",
      html: `Haz clic en el siguiente enlace para activar tu cuenta: ${activationLink} o bien: \n ${link2} `,
    };

    await transporter.sendMail(mailOptions);
    console.log("correo enviado");
  } catch (error) {
    console.error("Error al enviar el correo de activación:", error);
  }
};*/



/*const sendAmountEmail = async (userEmail, carrito) => {
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


export { sendActivationEmail,sendAmountEmail };*/


import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "storebarbarian30@gmail.com",
    pass: "tbiq wigy bfvx ahzq",
  },
});

const sendActivationEmail = async (userEmail, activationLink, link2) => {
  try {
    const mailOptions = {
      from: "storebarbarian30@gmail.com",
      to: userEmail,
      subject: "Activación de cuenta",
      html: `
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #000000;
              color: #ffffff;
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
              margin-bottom: 20px;
              text-align: center;
              color: #ffffff;
              display: flex;
              align-items: center; 
              justify-content: center; 
            }
            h1 span {
              margin-right: 10px; 
              justify-content:center;
            }
            p {
              margin-bottom: 10px;
            }
            strong {
              font-weight: bold;
            }
            .gracias {
              text-align: center;
              color: yellow;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1><span>&#128722;</span> Detalle de compras</h1>
            <p>Haz clic en el siguiente enlace para activar tu cuenta:</p>
            <p><a href="${activationLink}">${activationLink}</a></p>
            <p>O bien, haz clic en este enlace:</p>
            <p><a href="${link2}">${link2}</a></p>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Correo de activación enviado");
  } catch (error) {
    console.error("Error al enviar el correo de activación:", error);
  }
};

const sendAmountEmail = async (userEmail, carrito) => {
  try {
    let productosHTML = "";

    carrito.forEach((producto) => {
      productosHTML += `
        <div style="background-color: #000000; color: #ffffff; padding: 20px; margin-bottom: 20px; border-radius: 10px;">
          <p><strong>Nombre:</strong> ${producto.nombre}</p>
          <p><strong>Cantidad:</strong> ${producto.cantidad}</p>
          <p><strong>Talla:</strong> ${producto.talla}</p>
          <p><strong>Valor Total:</strong> ${producto.valTot}</p>
        </div>
      `;
    });

    const mailOptions = {
      from: "storebarbarian30@gmail.com",
      to: userEmail,
      subject: "Compra realizada - Barbarian-Web Team",
      html: `
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #000000;
              color: #ffffff;
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: auto;
              background-color: #000000;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
              margin-bottom: 20px;
              text-align: center;
              color: #ffffff;
              display: flex;
              align-items: center; 
              justify-content: center; 
            }
            h1 span {
              margin-right: 10px; 
            }
            p {
              margin-bottom: 10px;
            }
            strong {
              font-weight: bold;
            }
            .gracias {
              text-align: center;
              color: yellow;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1><span>&#128722;</span> Detalle de compras</h1>
            ${productosHTML}
            <p class="gracias">¡Gracias por su Compra!!</p>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Correo de compra confirmado enviado");
  } catch (error) {
    console.error("Error al enviar el correo de compra confirmado:", error);
  }
};

export { sendActivationEmail, sendAmountEmail };