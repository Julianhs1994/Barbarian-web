//import { response } from "express";


/*

document.getElementById("usuarios").addEventListener("click",async ()=>{
try{
    const respuesta = await fetch("/api/getAllUsers",{
        method: "POST",
        headers:{
           "Content-type":"application/json"
        }
    });
    if(respuesta.status != 200 || respuesta.status != 201){
        return
    }else{
        const resJson = await respuesta.json();
        if(resJson.redirect){
            const arrayData = resJson.arrayData;
            const encodeArrayData = encodeURIComponent(JSON.stringify(arrayData));
            const redirectURL = ""+resJson.redirect+"?value="+encodeArrayData;
            window.location.href = redirectURL;
        } 
    }
    
    }catch(err){
        console.error(err)
    }  
})*/
/*
var op=false
setInterval(function() {
    if(op!=false){
        return;
    }else{
        ;
    op = true;
    // Realizar una solicitud GET al servidor para obtener los datos actualizados
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/getAllUsers', true);
    
    xhr.onload = function() {
        //console.log("estatus:"+xhr.status)
      if (xhr.status === 200) {
        // Cuando la solicitud sea exitosa, procesa los datos recibidos
        var datos = JSON.parse(xhr.responseText);
        //console.log(xhr.responseText)
        console.log("entrada")
        console.log(datos)
        
        // Actualiza la tabla con los nuevos datos
        var tabla = document.getElementById('tabla-datos');
        var tbody = tabla.querySelector('tbody');
        
        // Borra los datos actuales de la tabla
        tbody.innerHTML = '';
        
        // Agrega los nuevos datos a la tabla
        datos.forEach(function(dato) {
          var fila = document.createElement('tr');
          //
          var usr_idColumna = document.createElement('td');
          usr_idColumna.textContent = dato.usr_id;
          fila.appendChild(usr_idColumna);
          //
          var usr_rol = document.createElement('td');
          usr_rol.textContent = dato.usr_rol;
          fila.appendChild(usr_rol);
          //
          var usr_tipo_documento = document.createElement('td');
          usr_tipo_documento.textContent = dato.usr_tipo_documento;
          fila.appendChild(usr_tipo_documento);
          //
          var usr_numero_documento = document.createElement('td');
          usr_numero_documento.textContent = dato.usr_numero_documento;
          fila.appendChild(usr_numero_documento);
          //
          var usr_nombre = document.createElement('td');
          usr_nombre.textContent = dato.usr_nombre;
          fila.appendChild(usr_nombre);
          //
          var usr_apellido = document.createElement('td');
          usr_apellido.textContent = dato.usr_apellido;
          fila.appendChild(usr_apellido);
          //
          var usr_email = document.createElement('td');
          usr_email.textContent = dato.usr_email;
          fila.appendChild(usr_email);
         
          tbody.appendChild(fila);
        });
      }
    };
    
    xhr.send();
  }}, 20000);  // Intervalo de tiempo para realizar la solicitud (en milisegundos)


  */
  $(document).ready(function() {
    $('#tabla-datos').DataTable({
      serverSide: true, // Habilita el modo de procesamiento en el lado del servidor
      ajax: {
        url: '/api/getAllUsers', // Ruta hacia tu función getAllUsers
        type: 'GET', // Método de solicitud
        data: function (data) {
          // Envía los parámetros necesarios para la paginación
          data.page = data.start / data.length + 1;
        }
      },
      columns: [
        { data: 'usr_id' },
        { data: 'usr_rol' },
        { data: 'usr_tipo_documento' }
      ]
    });
  });

  /*$(document).ready(function() {
    var table = $('#tabla-datos').DataTable({
     
      ajax: {
        url: '/api/getAllUsers',
        dataSrc: 'data'
      },
      columns: [
        { data: 'usr_id' },
        { data: 'usr_rol' },
        { data: 'usr_tipo_documento' },
       
      ],
      initComplete: function() {
        var api = this.api();
        var totalPages = api.ajax.json().totalPages;
        var paginationWrapper = $('.dataTables_paginate');
        console.log("datatables");
        for (var i = 0; i < totalPages; i++) {
          $('')
            .text(i + 1)
            .addClass('paginate_button')
            .appendTo(paginationWrapper)
            .on('click', function() {
              var page = $(this).text();
              api.page(parseInt(page) - 1).draw(false);
            });
        }
      }
    });
  });*/