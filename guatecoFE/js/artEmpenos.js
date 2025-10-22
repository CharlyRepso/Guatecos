$(function () {
    tooltipActive();
    GetArticulos();

});


const GetArticulos = () => {

    $.ajax({
      type: 'POST',
      url: '/bk_artEmpenos', // Reemplaza con la ruta correcta en tu servidor
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
  let estado = ``;
  
  
  

  for (const peticiones of ListArticulos) 
  {
      
      switch (peticiones.fkestadoEmpeno) {
        case 3:
          estado = `Pendiente de cancelar` 
          color = `primary`
          botones = `                    
          <button type="button" onclick="openDetail(${peticiones.idEmpeno})"  class="btn btn-outline-info  btn-lg" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Detalle Empeño" ><i class='bx bxs-detail' ></i></button>
          <button type="button" onclick="openAnular(${peticiones.idEmpeno})"   class="btn btn-outline-danger  btn-lg" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Anular Empeño" ><i class='bx bxs-x-circle bx-flip-vertical' ></i></button>`;
          break;
        case 6:
          
          botones = `<button type="button" onclick="openDetail(${peticiones.idEmpeno})"  class="btn btn-outline-info  btn-lg" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Detalle Empeño" ><i class='bx bxs-detail' ></i></button>`;
          color = `success`;

          break;
        case 25:

          botones = `<button type="button" onclick="openDetail(${peticiones.idEmpeno})"  class="btn btn-outline-info  btn-lg" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Detalle Empeño" ><i class='bx bxs-detail' ></i></button>`;
          color = `danger`;
          
          break;
        default:
          break;


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
                  <small><i class='bx bx-money'></i> Monto Total : <b>${ CastearValor(parseFloat(peticiones.valorEmpeo)) }</b></small>
              </div>
                
                <div class="text-center mt-2" >
                    ${botones}
                </div>
            </div>
            <div class="card-footer text-center" >
                <small class="text-${color}" > <b> ${peticiones.estado == "Aceptado" ? estado : peticiones.estado }</b></small> 
            </div>
        </div>
      </div>
      `;
  }

  $("#Contenedor").html(html);

  swiper();

}



const openDetail = (idEmpeno) => {

    let html2 = ``;

  let primerParrafo = ``;
  let segundoParrafo = ``;
 
  $.ajax({
    type: 'POST',
    async: false,
    url: '/bk_artEmpenos', 
    data:{ op:1,
          tipo : idEmpeno 
    }, 
    success: function (data) {

      for (const peticion of data) 
      {

        console.log(peticion);

        let total = ( parseFloat(peticion.valorEmpeo) * parseFloat(peticion.interes) + parseFloat(peticion.valorEmpeo) )
        let cuotaMensual = ( total / parseFloat(peticion.cuotas)    )

        if (peticion.idEstado == 2 ) {


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
                  <h6><i class='bx bxl-creative-commons' ></i> Interés brindado : <b>${ parseFloat(peticion.interes) * 100   }%</b></h6>
                  <h6><i class='bx bxs-wallet' ></i> Cuota mensual : <b>${ CastearValor(cuotaMensual) }</b></h6>
                  <h6><i class='bx bx-money-withdraw' ></i> Precio total : <b>${ CastearValor(total) }</b></h6>
                  <h6><i class='bx bxs-credit-card' ></i> Cuotas Pagadas : <b>${peticion.numPagos}/${peticion.cuotas}</b></h6>
                  <h6><i class='bx bxs-calendar'></i> Ultimo pago : <b>${ peticion.ultimaFechaPago != null ? new Date(peticion.ultimaFechaPago).toLocaleDateString() : "Sin pago realizado"   }</b></h6>
                  </div>
                  <div class="col-md-6" >
                  <h6><i class='bx bx-category' ></i> Categoria : <b>${peticion.tipo}</b></h6>
                  <h6><i class='bx bx-cart' ></i> Artículo : <b>${peticion.titulo}</b></h6>
                  <h6><i class='bx bxs-calendar'></i> Próximo pago : <b>${new Date(peticion.proximaFechaVencimiento).toLocaleDateString()}</b></h6>
                  <h6><i class='bx bxs-credit-card' ></i> Cuotas vencidas : <b>${peticion.CuotasVencidas}/${peticion.cuotas}</b></h6>
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



const openAnular = ( idEmpeno ) => {

  Swal.fire({
    title: '¿Seguro que desea anular este empeño?',
    text: "Esto provocará que el articulo sea consignado.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#198754',
    cancelButtonColor: '#dc3545',
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
      if (result.isConfirmed) {
          $.ajax({
              url: '/bk_artEmpenos',
              method: 'POST',
              async: false,
              data: {op: 3, idEmpeno : idEmpeno },
              success: function(data) {
                  if (data) {
                      Swal.fire(
                          'Anulado!',
                          'Se anuló el empeño el articulo fue pasado a consignado',
                          'success'
                      ).finally(() => {
                          location.reload();
                      });
                  }
                  else{
                      Swal.fire(
                          'Error al anular el empeño!',
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
  