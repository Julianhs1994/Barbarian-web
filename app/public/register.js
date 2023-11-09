document
  .getElementById("register-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    //console.log("llegando...");
    let nombre = e.target.children[0].children[1].value;
    let apellido = e.target.children[1].children[1].value;
    let tipoDocumento = e.target.children[2].children[1].value;
    let numeroDocumento = e.target.children[3].children[1].value;
    //console.log("Dato de prueba:",numeroDocumento);
    let email = e.target.children[4].children[1].value;
    let contrasenia = e.target.children[5].children[1].value;
    let confirmarContrasenia = e.target.children[6].children[1].value;

    if (!nombre || !apellido || !tipoDocumento || !numeroDocumento || !email) {
      document.getElementById("response-message").textContent =
        "Por favor, completa todos los campos.";
      return;
    }

    if (contrasenia.length < 5) {
      document.getElementById("response-message").textContent =
        "La contraseña debe tener al menos 5 caracteres.";
      return;
    }

    if (
      !/[a-z]/.test(contrasenia) ||
      !/[A-Z]/.test(contrasenia) ||
      !/\d/.test(contrasenia)
    ) {
      document.getElementById("response-message").textContent =
        "La contraseña debe contener letras mayúsculas, minúsculas y números.";
      return;
    }

    if (contrasenia !== confirmarContrasenia) {
      document.getElementById("response-message").textContent =
        "La contraseña y la confirmación de contraseña no coinciden.";
      return;
    }

    const respuesta = await fetch(
      // "/api/register"
      "https://barbarian-web-koqc.vercel.app/api/register",
      {
        method: "post",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          /*user:user,
            email:email,
            password:password*/
          usr_tipo_documento: tipoDocumento,
          usr_numero_documento: numeroDocumento,
          usr_nombre: nombre,
          usr_apellido: apellido,
          usr_email: email,
          usr_contrasenia: contrasenia,
        }),
      }
    );
    if (respuesta.status != 201 && respuesta.status != 200) {
      const responseJson = await respuesta.json();
      if (responseJson.message) {
        document.getElementById("response-message").textContent =
          responseJson.message;
      }
    } else {
      //lectura del json del body
      const resJson = await respuesta.json();
      if (resJson.redirect) {
        window.location.href = resJson.redirect;
      }
    }
  });
