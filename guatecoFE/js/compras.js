loadSales();

function loadSales(){
    const datosDesdeBD = dataItems();
    if (datosDesdeBD.length > 0) {
        CreateCards(datosDesdeBD);
    }
    else{
        NOT_FOUND();
    }

    const swiper = new Swiper('.swiper', {
        direction: 'horizontal',
        loop: true,
        pagination: {
            el: '.swiper-pagination',
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        scrollbar: {
            el: '.swiper-scrollbar',
        },
    });

}

document.querySelectorAll('.abrir-modal').forEach((elemento) => {
    elemento.addEventListener('click', () => {
      // Obtén el valor del atributo "id" del elemento clickeado
      const idVenta = elemento.getAttribute('id_sale');
      setDataSale(idVenta);
    });
});

function CreateCards(datos) {
    //console.log(datos);
    const cardsContainer = document.querySelector('.card-deck');
    cardsContainer.innerHTML = '';

    datos.forEach((dato, index) => {
        
        var imagenes = "";
        
        dato.imagenes.forEach(element => {
            imagenes += `<div class="swiper-slide"><img class="img" src="${element}" alt=""></div>`;
        });
        
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("col-md-4", "mb-4");
    
        cardDiv.innerHTML = `
            <div class="card" style="width: 20rem; height: 25rem;">
                <div class="swiper">
                    <div class="swiper-wrapper">
                        ${imagenes}
                    </div>
                    <div class="swiper-pagination"></div>
                    <div class="swiper-button-prev"></div>
                    <div class="swiper-button-next"></div>
                    <div class="swiper-scrollbar"></div>
                </div>
                <div class="card-body">
                    <h5 class="card-title"><strong>${dato.titulo}</strong></h5>
                    <p class="card-text">${dato.descripcion}</p>
                    <div class="text-center">
                        <button id_sale='${dato.idVenta}' type="button" class="btn btn-success abrir-modal" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Detalle"><i class='bx bx-cart-download'></i> Comprar</button>
                    </div>
                </div>
                <div class="card-footer">
                <p class="card-text"><strong>Precio:</strong> Q.${dato.precio}</p>
                </div>
            </div>
           
        `;
        cardsContainer.appendChild(cardDiv);
    });
} 

function dataItems() {
    let data_;
    $.ajax({
        url: '/bk_compras', // Cambia la URL según tu configuración
        method: 'POST',
        async: false,
        data: {op:1},
        success: function (data) {
            data_ = data;
        }
    });
    return data_;
} 

function setDataSale(id) {
    $("#lg_modal_title").html(`
        Formulario - Solicutd de Compra
    `);
    $("#lg_modal_content").html(`
        <form id="form_sale" id_sale="${id}">
            <div class="row mb-3">
                <div class= "col-4">
                    <div class="form-floating">
                        <select class="form-select" id="banco" name="banco"required>
                            <option selected disabled value=''>...</option>
                            <option value="Banrural">Banrural</option>
                            <option value="BI">BI</option>
                            <option value="BAC">BAC</option>
                            <option value="Promerica">Promerica</option>
                        </select>
                        <label for="banco">Banco</label>
                    </div>
                </div>
                <div class= "col-4">
                    <div class="form-floating">
                        <select class="form-select" id="tipo_pago" name="tipo_pago" required>
                            <option selected disabled value=''>...</option>
                            <option value="1">Deposito</option>
                            <option value="2">Tranferencia</option>
                        </select>
                        <label for="tipo_pago">Seleccione Tipo de Pago</label>
                    </div>
                </div>
                <div class= "col-4">
                    <div class="form-floating">
                        <input type="text" class="form-control" id="numDoc" placeholder="Número de Documento" name="numDoc"required>
                        <label for="numDoc">Número de Documento</label>
                    </div>
                </div>
            </div>
            <div class="row mb-3">
                <div class= "col-4">
                    <div class="form-floating">
                        <input type="number" class="form-control" id="valPagado"  placeholder="Total Pagado" name="valPagado" required>
                        <label for="valPagado">Total Pagado</label>
                    </div>
                </div>
                <div class= "col-4">
                    <div class="form-floating">
                        <input type="text" class="form-control" id="nit" placeholder="NIT" name="nit"required>
                        <label for="nit">NIT</label>
                    </div>
                </div>
                <div class= "col-4">
                    <div class="form-floating">
                        <input type="text" class="form-control" id="direccion" placeholder="Dirección de Entrega" name="direccion" required>
                        <label for="direccion">Dirección de Entrega</label>
                    </div>
                </div>
            </div>
            <div class="row d-flex justify-content-center">
                <div class="col-3">
                    <button type="submit" class="btn btn-info align-middle"><i class='bx bxs-shopping-bag'></i>&nbsp;&nbsp;Comprar</button>
                </div>
            </div>
        </form>
    `)


    $("#lg_modal").modal('show');

    document.getElementById('form_sale').addEventListener('submit', e => {
        e.preventDefault();
        const form = e.target; 
        var formData = new FormData(form)
        const id_sale = form.getAttribute('id_sale');
        formData.append('op',2);
        formData.append('id_sale',id_sale);
        new_data = Object.fromEntries(formData);
        Swal.fire({
            title: '¿Enviar Solicitud de Compra?',
            text: "Al aceptar estas, confirmando que los datos son correctos si alguno de estos es inconsistentes o irregulares tu solicitud puede ser rechaza. Y podrías perder tu dinero.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Enviar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
                sendRequest(new_data);
            }
          });
       
    });
}

function sendRequest(new_data) {
    $.ajax({
        type: 'POST',
        url: '/bk_compras',
        data: new_data,
        async: true,
        success: function(response) {
            console.log(response);
            Swal.fire({
                icon: 'success',
                title: 'Formulario Enviado!',
                text: 'Su Solcitud ha sido enviada con exito.',

            }).finally(() => {
                //enviarParametro(6);
                location.reload();
            });
        },
        error: function(error) {
            Swal.fire({
                icon: 'error',
                title: `Oops...!`,
                html: `<ol class="list-group">${error.statusText}</ol>`
            });
        }
    });
}

function NOT_FOUND() {
    const cardsContainer = document.querySelector('.card-deck');
    cardsContainer.innerHTML = `
        <div class="row d-flex justify-content-center">
            <div class="col-6 text-center">
                </br></br></br>
                <div class="alert alert-warning" role="alert">
                    <h2>No hay articulos en venta&nbsp;&nbsp;<i class='bx bx-sad bx-md'></i></h2>
                </div>
            </div>
        </div>
    `;
}