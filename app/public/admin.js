let boton = document.querySelectorAll(".btn-expandir")
let textoExpandir = document.querySelectorAll(".textoExpandir")

boton.forEach((elemento,clave) => {
    elemento.addEventListener("click",()=>{
        textoExpandir[clave].classList.toggle("textoExpandir")
        textoExpandir[clave].classList.toggle("abrirCerrar")
    })
});

//->Alternar visibilidad:

let botonRectangle = document.querySelectorAll(".option-user");
const element = document.getElementById("DivUsers");
let botonRectangle2 = document.querySelectorAll(".option-product");
const element2 = document.getElementById("DivProducts");
const p = document.getElementById("parrafo");


botonRectangle.forEach((elemento,clave) =>{
  elemento.addEventListener("click",()=>{
    if(element.className=="DivUsers"){
      element.classList.remove("DivUsers")
      element.classList.toggle("datatableShow")
      element2.classList.add("DivProducts")
    }else{
      element.classList.toggle("DivUsers")
      element2.classList.add("DivProducts")
    }
    //p.classList.add("Hidden")
    p.style.display = 'none';
  })
})


botonRectangle2.forEach((elemento,clave) =>{
  elemento.addEventListener("click",()=>{
    if(element2.className=="DivProducts"){
      element2.classList.remove("DivProducts");
      element2.classList.toggle("datatableShow");
      //element2.classList.add("table2"/*, "clase2"*/);
      element.classList.add("DivUsers")
    }else{
      element2.classList.toggle("DivProducts")
      element.classList.add("DivUsers");
    }
    //p.classList.add("Hidden")
    p.style.display = 'none';
  })
})

//->datatTable configs:

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
        { data: 'usr_email' },
        { data: 'usr_estado'},
        {
          data: 'usr_id',
          render: function (data, type, row) {
            return '<button class="editar"  value="' + data + '">Editar</button>';
          }
        }, 
        {
          data: 'usr_id',
          render: function (data, type, row) {
            return '<button class="eliminar" value="' + data + '">Eliminar</button>';
          }
        }  
      ]
    });
  });

  //
  $(document).ready(function() {
    $('#tabla-productos').DataTable({
      serverSide: true, // Habilita el modo de procesamiento en el lado del servidor
      "language": {
        "url": "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
      },
      "lengthMenu": [2, 3, 4, 5], // Cambiar opciones de paginación
    
      ajax: {
        url: '/api/getAllProducts', // Ruta hacia tu función getAllUsers
        type: 'GET', // Método de solicitud
        data: function (data) {
          // Envía los parámetros necesarios para la paginación
          data.page = data.start / data.length + 1;
        }
      },
      columns: [
       // { data: 'usr_id' },
        { data: 'pdc_nombre'},
        //{ data: 'pdc_imagen'},
        {
          data: 'pdc_imagen',
          render: function (data, type, row) {
            //return '<button class="editar"  value="' + data + '">Editar</button>';
            return '<img class="imagenProd" src="'+data+'">';
          }
        }, 
        { data: 'pdc_fk_seccion'},
        { data: 'pdc_descripcion'},
        { data: 'pdc_fk_marca'},
        { data: 'pdc_fk_color'},
        { data: 'pdc_valor'},
        { data: 'cant_xs'},
        { data: 'cant_s'},
        { data: 'cant_m'},
        { data: 'cant_l'},
        { data: 'cant_xl'},
        {
          data: 'pdc_id',
          render: function (data, type, row) {
            //            return '<button class="editar"  data-id="' + data + '">Editar</button>';
            return '<button class="editar"  value="' + data + '">Editar</button>';
          }
        }, 
        {
          data: 'pdc_id',
          render: function (data, type, row) {
            return '<button class="eliminar" value="' + data + '">Eliminar</button>';
          }
        } 
        
      ]
      //
      
    });
    
  });

  //->Eliminar PRODUCTO "onClick":
  $('#tabla-productos').on('click', '.eliminar', async function() {
  //document.addEventListener('DOMContentLoaded', function () { 
    const btnEliminar = document.querySelectorAll('.eliminar'); 
    btnEliminar.forEach(btn => {     
      btn.addEventListener('click',async function () {
      //const id = this.value;
      const id = $(this).val();
      console.log("id js:"+id)
      if (confirm('¿Seguro que quieres eliminar este producto?')) {   
      // Fetch para enviar una solicitud DELETE al servidor<br/>
      const response = await fetch(`api/deleteProduct/`, {
        method: 'POST',
        headers:{
          "Content-type":"application/json"
        },
        body:JSON.stringify({
          id:id
        }) 
      });
      if(response){
        const res = await response.json();
        alert(res.message);
        window.location.href = res.redirect;
      } 
  }      
});    
});  
});

//->Editar PRODUCTO "onClick"
$('#tabla-productos').on('click', '.editar', async function() {
  const btnEditar = document.querySelectorAll('.editar'); 
    btnEditar.forEach(btn => {     
      btn.addEventListener('click',async function () {
      //const id = this.value;
      const id = $(this).val();
      const response = await fetch(`api/getEditProduct`,{
        method:"POST",
        headers:{
          "Content-type":"application/json"
        },
        body:JSON.stringify({
          id:id
        })
      })
      if (response.status != 200){
        return
      }else{
        const res = await response.json();
        window.location.href = res.redirect
      }
    });
  });    
})

  //->Eliminar USUARIO "onClick":
  $('#tabla-datos').on('click', '.eliminar', async function() {
      const btnEliminar = document.querySelectorAll('.eliminar'); 
      btnEliminar.forEach(btn => {     
        btn.addEventListener('click',async function () {
        //const id = this.value;
        const id = $(this).val();
        console.log("id js:"+id)
        if (confirm('¿Seguro que quieres eliminar este usuario?')) {   
        // Fetch para enviar una solicitud DELETE al servidor<br/>
        const response = await fetch(`api/deleteUser/`, {
          method: 'POST',
          headers:{
            "Content-type":"application/json"
          },
          body:JSON.stringify({
            id:id
          }) 
        });
        if(response){
          const res = await response.json();
          alert(res.message);
          window.location.href = res.redirect;
        } 
    }      
  });    
  });  
  });

//->Editar USUARIO "onClick"
$('#tabla-datos').on('click', '.editar', async function() {
  const btnEditar = document.querySelectorAll('.editar'); 
    btnEditar.forEach(btn => {     
      btn.addEventListener('click',async function () {
      //const id = this.value;
      const id = $(this).val();
      const response = await fetch(`api/getEditUser`,{
        method:"POST",
        headers:{
          "Content-type":"application/json"
        },
        //->enviar id al controlador con el que haremos la consulta.
        body:JSON.stringify({
          id:id
        })
      })
      if (response.status != 200){
        return
      }else{
        const res = await response.json();
        window.location.href = res.redirect
      }
    });
  });    
})

