
let ListEmpenos = [];

var empeno;
var tipoC;
let bodyHtml;
let htmlfooter;
let precio;
let interes;
let cuotas;

var empenoReneg = {

  idEmpeno : 0,
  fkEstado : 0,
  valorEmpeo : 0,
  cuotas : 0,
  fkCuota : 0

}

$(function () {

  
  LLenarABC();
  GetArticulos();
  tooltipActive();
  

  
  
  
});


const openRenegociar = (idEmpeno) => {

  
  $.ajax({
    type: 'POST',
    async: false,
    url: '/bk_peticiones', 
    data:{ op:3,
      tipo : idEmpeno }, 
    success: function (data) {

      empeno = data.empR;
      tipoC = data.tc;
       
      
       
      },
      error: function (error) {
          console.error('Error:', error);
          
      }
  });


  

  $("#lg_modal").modal("show");
  let html = `<h4 class="text-center" > Renegociar Empeño </h4>`

  $("#lg_modal_title").html(html);


  for (const emp of empeno) {
    
    let interes = parseFloat(emp.interes) * 100;

    let recargo = parseFloat(emp.interes) * parseFloat(emp.valor);

    let total = parseFloat(emp.valor) + recargo;

    bodyHtml = `
        <form id="formReneg">
        <div class="row">
            <div class="col-6 space mt-2 ">
                <div class="form-floating">
                    <input type="number" class="form-control " value="${ parseFloat(emp.valor) }"  id="input_precio" name="precio" required>
                    <label for="input_precio">Precio Q.</label>
                </div>
            </div>
            <div class="col-6 space mt-2">
                <div class="form-floating">
                    <select class="form-select in_sol" id="select_tipo_cuota" name="cuota" required>
                        <option selected value='${emp.fkcuota}'>${emp.cuotas}</option>
                    </select>
                    <label for="select_tipo_art">Cantidad de Cuotas</label>
                </div>
            </div>
            <div class="col-4 space mt-2">
                <div class="input-group">
                    <span class="input-group-text" id="label_interes">Interes ${interes}% Q.</span>
                    <input type="text" class="form-control" value="${ (recargo).toFixed(2)  }"  id ="txt_interes" aria-describedby="label_interes" disabled>
                </div>
            </div>
            <div class="col-4 space mt-2">
                <div class="input-group">
                    <span class="input-group-text" id="label_total">Total Q.</span>
                    <input type="text" class="form-control" value="${total}"  id ="txt_total" aria-describedby="label_total" disabled>
                </div>
            </div>
            <div class="col-4 space mt-2">
                <div class="input-group">
                    <span class="input-group-text" id="label_mes">Cuota Q.</span>
                    <input type="text" class="form-control" value="${total / emp.cuotas}"  id ="txt_mes" name="valor_cuota" aria-describedby="label_mes" disabled>
                </div>
            </div>
        </div>
      </form>

  
    `;

    htmlfooter = ` 
    <div style="justify-content: space-between;" >
    <button type="button" class="btn btn-success" onclick=(EnviarNegociacion(${emp.idEmpeno }))  >Confirmar</button> 
    </div>
    `;
  }
  

  $("#lg_modal_content").html(bodyHtml);

  $("#lg_modal_footer").html(htmlfooter);


  $("#input_precio").change(()=>{
    calcularCuotas();
  });

  $("#select_tipo_cuota").change(()=>{
      cuotas =  parseInt($('#select_tipo_cuota').find('option:selected').html());
      calc(interes, cuotas, precio);
  });

}

function calcularCuotas() {

  $("#select_tipo_cuota").empty();
    precio = parseInt($("#input_precio").val());
    interes = 0;
    no_min = false;

    for (let index = 0; index < tipoC.length; index++) {
        const element = tipoC[index];
        if(precio < element.rangoMin && index == 0){
            no_min = true;
            break;
        }
        if (precio >= element.rangoMin) {
            interes = element.interes;

            cuotas =  parseInt($('#select_tipo_cuota').find('option:selected').html());

            calc(interes, cuotas, precio);
            

            let htmlcuotas = ``;

            for (let j = 0; j <= index; j++) {
                const element_ = tipoC[j];

                htmlcuotas += `<option value="${element.idCuotas}">${element_.meses}</option>`;

              }
              
              $("#select_tipo_cuota").html(htmlcuotas);
        }
    }
    
    cuotas =  parseInt($('#select_tipo_cuota').find('option:selected').html());
    if (!no_min) {
        calc(interes, cuotas, precio)
    }
    else{
        $("#label_interes").html(`Interes`);
        $("#txt_interes").val('');
        $("#txt_total").val('');
        $("#txt_mes").val('');
    }

}

function  calc(interes, cuotas, precio) {
  let porcentaje = parseFloat(100 * interes);
  let recargo = parseFloat(interes * precio);
  let total = parseFloat(precio + recargo);
  let mensualidad = parseFloat(total / cuotas);

  $("#label_interes").html(`Interes ${porcentaje}% Q.`);
  $("#txt_interes").val(recargo.toFixed(2));
  $("#txt_total").val(total.toFixed(2));
  $("#txt_mes").val(mensualidad.toFixed(2));
}


const EnviarNegociacion = (idEmpeno) => {

  empenoReneg.idEmpeno = idEmpeno  ,
  empenoReneg.fkEstado = 2,
  empenoReneg.valorEmpeo = $("#input_precio").val(),
  empenoReneg.cuotas = parseInt($('#select_tipo_cuota').find('option:selected').html()),
  empenoReneg.fkCuota =  parseInt($("#select_tipo_cuota").val()) 


  $.ajax({
    type: 'POST',
    async: false,
    url: '/bk_peticiones', 
    data:{ op:4,
      objeto : empenoReneg
    }, 
    success: function (data) {

      Swal.fire({
        icon: 'success',
        title: 'Renegociación Completada!',
        text: 'Su cambio ha sido enviado con exito.',

      }).finally(() => {
        window.location.reload();
      });
       
      },
      error: function (error) {
        Swal.fire({
          icon: 'error',
          title: `Oops...!`,
          html: `<ol class="list-group">No se pudo renegociar el empeño</ol>`
      });
     
      }
  });


}



const openDetail = (idEmpeno) => {
  let html2 = ``;

  let primerParrafo = ``;
  let segundoParrafo = ``;
 
  $.ajax({
    type: 'POST',
    async: false,
    url: '/bk_peticiones', 
    data:{ op:2,
          tipo : idEmpeno 
    }, 
    success: function (data) {

      for (const peticion of data) 
      {
        let total = ( parseFloat(peticion.valor) * parseFloat(peticion.interes) + parseFloat(peticion.valor) )
        let cuotaMensual = ( total / parseFloat(peticion.cuotas)    )

        if (peticion.idEstado == 2 ) {

          let total2 = ( parseFloat(peticion.valorEmpeo) * parseFloat(peticion.interesEmp) + parseFloat(peticion.valorEmpeo) )
          let cuotaMensual2 = ( total2 / parseFloat(peticion.cuotasEmp)    )

          primerParrafo = ` <h6>En Negociacion :<h6>`;
          segundoParrafo = `
          
          <h6 class="text-primary" ><i class='bx bx-money' ></i> Precio : <b>${ CastearValor(parseFloat(peticion.valorEmpeo))  }</b></h6>
          <h6 class="text-primary" ><i class='bx bxs-credit-card' ></i> Cuotas : <b>${peticion.cuotasEmp}</b></h6>
          <h6 class="text-primary" ><i class='bx bxl-creative-commons' ></i> Interés : <b>${ parseFloat(peticion.interesEmp) * 100   }%</b></h6>
          <h6 class="text-primary" ><i class='bx bxs-wallet' ></i> Cuota mensual : <b>${ CastearValor(cuotaMensual2) }</b></h6>
          <h6 class="text-primary" ><i class='bx bx-money-withdraw' ></i> Precio total : <b>${ CastearValor(total2) }</b></h6>
          

          `;

        }


        html2 = `
            <div class="row" >
              <div class="col-md-6 row" >
                <div class="col-md-6" >
                  <h6><i class='bx bx-user'></i> Persona : <b> ${peticion.nombre} ${peticion.apellido} </b></h6>
                  <h6><i class='bx bxl-gmail' ></i> Correo : <b>${peticion.correo}</b></h6>
                  <h6><i class='bx bxs-calendar'></i> Publicacion : <b>${new Date(peticion.fechaIngreso).toLocaleDateString()}</b></h6>
                  <h6><i class='bx bx-money' ></i> Precio : <b>${ CastearValor(parseFloat(peticion.valor))  }</b></h6>
                  <h6><i class='bx bxs-credit-card' ></i> Cuotas solicitadas : <b>${peticion.cuotas}</b></h6>
                  <h6><i class='bx bxl-creative-commons' ></i> Interés solicitado : <b>${ parseFloat(peticion.interes) * 100   }%</b></h6>
                  <h6><i class='bx bxs-wallet' ></i> Cuota mensual : <b>${ CastearValor(cuotaMensual) }</b></h6>
                  <h6><i class='bx bx-money-withdraw' ></i> Precio total : <b>${ CastearValor(total) }</b></h6>
                </div>
                <div class="col-md-6" >
                  <h6><i class='bx bx-category' ></i> Categoria : <b>${peticion.tipo}</b></h6>
                  <h6><i class='bx bx-cart' ></i> Articulo : <b>${peticion.titulo}</b></h6>
                  <h6><i class='bx bxs-message-square-detail bx-flip-horizontal' ></i> Descripcion : <b><p>${peticion.descripcion}</p></b></h6>
                  ${primerParrafo}
                  ${segundoParrafo}
                  </div>
                
              </div>
              <div class="col-md-6" >
                <div class="swiper" style="width: 50%; ">
                  <div class="swiper-wrapper  " >


                  `
                  for (const imagen of peticion.imagenes) 
                  {
                    html2 += `<div class="swiper-slide"><img class="img" src="${imagen.Imagen}" alt=""></div>`  
                  }


                  html2 +=
                  `
                  
        
                  </div>
        
                  <div class="swiper-pagination"></div>
        
                  <div class="swiper-button-prev"></div>
                  <div class="swiper-button-next"></div>
              
        
                  <div class="swiper-scrollbar"></div>
                </div>
              </div>
            </div>
        `;
      }

      
    },
    error: function (error) {
      console.error('Error:', error);
      
    }
  });
  
 
  


  
  $("#xl_modal").modal("show");

  let html = `<h4 class="text-center" > Detalle de Empeño </h4>`

  $("#xl_modal_title").html(html);

   
  

  

  $("#xl_modal_content").html(html2);
  swiper();



}


const GetArticulos = () => {

  $.ajax({
    type: 'POST',
    url: '/bk_peticiones', // Reemplaza con la ruta correcta en tu servidor
    data:{ op:1 }, // Los datos que quieres enviar al servidor
    success: function (data) {
       
      ListEmpenos = data;


      DrawPeticiones(ListEmpenos);
      tooltipActive();
       
    },
    error: function (error) {
        console.error('Error:', error);
        
    }
});


}


const DrawPeticiones = (ListArticulos) => {

  let html = ``;
  let botones = ``;
  let color = ``;
  
  

  for (const peticiones of ListArticulos) 
  {
      

      if(peticiones.fkestadoEmpeno == 1 ) {

          

        color = `info`
        botones = `                    
        <button type="button" onclick="openAceptarPet(${peticiones.idEmpeno}, ${parseFloat(peticiones.valor)}, ${peticiones.cuotas})" class="btn btn-outline-success  btn-lg" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Aceptar peticion" ><i class='bx bxs-check-circle' ></i></button>
        <button type="button" onclick="openRenegociar(${peticiones.idEmpeno})" class="btn btn-outline-warning  btn-lg" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Renegociar Peticion" ><i class='bx bxs-edit' ></i></button>
        <button type="button" onclick="openDetail(${peticiones.idEmpeno})"  class="btn btn-outline-info  btn-lg" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Detalle peticion" ><i class='bx bxs-detail' ></i></button>
        <button type="button" onclick="openRechazar(${peticiones.idEmpeno})"   class="btn btn-outline-danger  btn-lg" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Rechazar peticion" ><i class='bx bxs-x-circle bx-flip-vertical' ></i></button>`;
      } else 
      {
        botones = `<button type="button" onclick="openDetail(${peticiones.idEmpeno})"  class="btn btn-outline-info  btn-lg" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Detalle peticion" ><i class='bx bxs-detail' ></i></button>`;
        color = `danger`;
      }

      html += `
      <div class="col-md-4 mb-4 " style="flex: auto;">
        <div class="card" style="width: 20rem;">
            <div class="swiper">
                <div class="swiper-wrapper">
                    `
                
                    for (const imagen of peticiones.imagenes) 
                    {
                      html += `<div class="swiper-slide"><img class="img" src="${imagen.Imagen}" alt=""></div>`  
                    }
                  
                  
                 html += `

                 

                </div>
         
                <div class="swiper-pagination"></div>
   
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
            
         
                <div class="swiper-scrollbar"></div>
            </div>
            <div class="card-body">
              <h5 class="card-title">${peticiones.titulo} </h5>
              <div class="row col-md-12 ">
                  <div class="col-md-12">
                      <small><i class='bx bxs-user-circle'></i> Usuario : <b>${peticiones.userName}</b></small>
                  </div>
                  <div class="col-md-12">
                      <small><i class='bx bx-envelope    ' ></i> Correo : <b>${peticiones.correo}</b></small>
                  </div>
                  <small><i class='bx bx-star'></i> Estado : <b>${peticiones.ponderacion}/10</b></small>
                  <small><i class='bx bx-money'></i> Precio agregado : <b>${ CastearValor(parseFloat(peticiones.valor)) }</b></small>
              </div>
                
                <div class="text-center mt-2" >
                    ${botones}
                </div>
            </div>
            <div class="card-footer text-center" >
                <small class="text-${color}" > <b> ${peticiones.estado}</b></small> 
            </div>
        </div>
      </div>
      `;
  }

  $("#Contenedor").html(html);

  swiper();

  
}


const openAceptarPet = (IdEmpeno, Valor, Cuota ) => {

  let Empeno = {
    idEmpeno :  IdEmpeno,
    valor : Valor ,
    cuotas : Cuota,
    estado : 3
  }

  Swal.fire({
    title: '¿Seguro que desea aceptar esta postulacion?',
    text: "Esto provocará que el empeño pase a articulos empeñados.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#198754',
    cancelButtonColor: '#dc3545',
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
      if (result.isConfirmed) {
          $.ajax({
              url: '/bk_peticiones',
              method: 'POST',
              async: false,
              data: {op: 6, objeto : Empeno },
              success: function(data) {
                  if (data) {
                      Swal.fire(
                          'Aceptado!',
                          'Se aceptó el empeño, puede ir a articulos empeñados!',
                          'success'
                      ).finally(() => {
                          location.reload();
                      });
                  }
                  else{
                      Swal.fire(
                          'Error al aceptar el empeño!',
                          'Comuniquese al Soporte Tecnico.',
                          'error'
                      )
                  }
              }
          });
      }
  })




}



const LLenarABC = () => {

  let html = ``;

  for (var i = 65; i <= 90; i++) 
  {
    var letra = String.fromCharCode(i); 
    
    html += `
    <span class="text-primary cursor"  >${letra}</span>`;

  }

  html += `<span class="text-primary cursor  "  >Mostrar todos</span>`;
  $("#Barrita").html(html);

}

const openRechazar = (idEmpeno) => {


  Swal.fire({
    title: '¿Seguro que desea rechazar esta postulacion?',
    text: "Esto provocará que el empeño desaparezca de este listado.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#198754',
    cancelButtonColor: '#dc3545',
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
      if (result.isConfirmed) {
          $.ajax({
              url: '/bk_peticiones',
              method: 'POST',
              async: false,
              data: {op: 5, tipo : idEmpeno },
              success: function(data) {
                  if (data) {
                      Swal.fire(
                          'Rechazado!',
                          'Se rechazó el empeño',
                          'success'
                      ).finally(() => {
                          location.reload();
                      });
                  }
                  else{
                      Swal.fire(
                          'Error al rechazar el empeño!',
                          'Comuniquese al Soporte Tecnico.',
                          'error'
                      )
                  }
              }
          });
      }
  })


}


const swiper = () => {

  const swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
  
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  
    // And if we need scrollbar
    scrollbar: {
      el: '.swiper-scrollbar',
    },
  });

}


const CastearValor = (numero) => {
  return numero.toLocaleString("es-GT", { style: "currency", currency: "GTQ" });
}
