async function cryptoData(parametroString,forPost) {

    function base64encode(input) {
        return btoa(String.fromCharCode(...new Uint8Array(input)))
    }

    function base64decode(input) {
        return Uint8Array.from(atob(input), c => c.charCodeAt(0))
    }

    async function generateKeys() {
        const { publicKey, privateKey } = await crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 2048,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: { name: "SHA-1" },
            },
            true,
            ["encrypt", "decrypt"]
        )
        return { publicKey, privateKey }
    }

    async function exportPKCS8PrivateKeyPem(privateKey) {
        let privatePem = await crypto.subtle.exportKey('pkcs8', privateKey)
        return `-----BEGIN PRIVATE KEY-----\n` + base64encode(privatePem).match(/.{1,64}/g).join('\n') + `\n-----END PRIVATE KEY-----`;
    }

    async function exportSPKIPublicKeyPem(publicKey) {
        const publicPem = await crypto.subtle.exportKey('spki', publicKey);
        return `-----BEGIN PUBLIC KEY-----\n` + base64encode(publicPem).match(/.{1,64}/g).join('\n') + `\n-----END PUBLIC KEY-----`;
    }

    async function importSPKIPublicKeyPem(publicKey) {
        const publicKeyBase64SingleLineWithoutHeaders = publicKey.split('\n').filter(line => !line.startsWith('-----')).join('')
        return await crypto.subtle.importKey(
            "spki",
            base64decode(publicKeyBase64SingleLineWithoutHeaders),
            { name: "RSA-OAEP", hash: { name: "SHA-1" } },
            false,
            ["encrypt"]
        )
    }

    const { publicKey, privateKey } = await generateKeys()
    const privatePem = await exportPKCS8PrivateKeyPem(privateKey)
    const publicPem = await exportSPKIPublicKeyPem(publicKey)


    console.log('Recuperando la clave pública del servidor')
    const serverPublicKeyPem = await fetch('/public').then(r => r.text())
    const serverPublicKey = await importSPKIPublicKeyPem(serverPublicKeyPem)


    const text = parametroString;//"Hola que tal"

    console.log('Generando clave AES y iv bytes')
    const key = crypto.getRandomValues(new Uint8Array(32));
    const iv = crypto.getRandomValues(new Uint8Array(16));

    console.log('Encriptando texto')
    const secret = await crypto.subtle.importKey("raw", key, { name: 'AES-CBC', length: 256 }, false, ["encrypt", "decrypt"])
    const encrypted = await crypto.subtle.encrypt({ name: "AES-CBC", iv: iv }, secret, new TextEncoder().encode(text))

    console.log('Encriptando resultado con la clave pública del servidor')
    const keyenc = await crypto.subtle.encrypt({ name: "RSA-OAEP" }, serverPublicKey, key)

    console.log('Preparando el payload')
    const payload = {
        key: base64encode(keyenc),
        iv: base64encode(iv),
        text: base64encode(encrypted),
        publicKey: publicPem
    }

    //fetch example: 
    /*fetch("/login", {
        method: 'POST',
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(payload)
    })
        .then((response) => response)
        .then((result => {
            console.log(result);
        }))*/

        const respuesta = await fetch("/api/login", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(
                payload
            ),
          });
          if (respuesta.status != 201 && respuesta.status != 200) {
            const responseJson = await respuesta.json();
            if (responseJson.message) {
              document.getElementById("response-message").textContent =
                responseJson.message;
            }
          } else {
            const resJson = await respuesta.json();
            if (resJson.redirect) {
              window.location.href = resJson.redirect;
            }
          }    
}


/*const boton = document.getElementById("send_information");

boton.addEventListener("click", async function () {

    cryptoData();

});*/