let boton = document.querySelectorAll(".btn-expandir")
let textoExpandir = document.querySelectorAll(".textoExpandir")

boton.forEach((elemento,clave) => {
    elemento.addEventListener("click",()=>{
        textoExpandir[clave].classList.toggle("textoExpandir")
        textoExpandir[clave].classList.toggle("abrirCerrar")
    })
});

let botonRectangle = document.querySelectorAll(".options");
//let tabla = document.querySelectorAll(".DivUsers");
const element = document.getElementById("DivUsers");
botonRectangle.forEach((elemento,clave) =>{
  elemento.addEventListener("click",()=>{
    if(element.className=="DivUsers"){
      element.classList.remove("DivUsers")
      element.classList.toggle("datatableShow")
    }else{
      element.classList.toggle("DivUsers")
    }
  })
})

  $(document).ready(function() {
    $('#tabla-datos').DataTable({
      serverSide: true, // Habilita el modo de procesamiento en el lado del servidor
      "language": {
        "url": "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
      },
      "lengthMenu": [2, 3, 4, 5], // Cambiar opciones de paginación
    
      ajax: {
        url: '/api/getAllUsers', // Ruta hacia tu función getAllUsers
        type: 'GET', // Método de solicitud
        data: function (data) {
          // Envía los parámetros necesarios para la paginación
          data.page = data.start / data.length + 1;
        }
      },
      columns: [
       // { data: 'usr_id' },
        { data: 'usr_rol' },
        { data: 'usr_tipo_documento' },
        { data: 'usr_numero_documento' },
        { data: 'usr_nombre'},
        { data: 'usr_apellido'},
        { data: 'usr_email' } 
      ]
    });
  });

