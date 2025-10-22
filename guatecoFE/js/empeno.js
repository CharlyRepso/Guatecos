load_log()
load_selected()

function load_log() {
    $("#prev_images").html(`
        <div class="col-12 d-flex justify-content-center logo_pre">
            <i class='bx bx-images' style="font-size: 120px;"></i>
        </div>
    `)
}

//CARGAMOS LOS TIPOS DE ARTICULOS  Y CUOTAS DISPINIBLES
function load_selected() {
    var ta;
    var tc;
    var precio;
    var interes;
    var cuotas;

    $.ajax({
        url: '/bk_empeno',
        method: 'POST',
        async: false,
        data: {op:1},
        success: function(data) {
            ta = data.ta;
            tc = data.tc;
        }
    }); 

    ta.forEach(function callback(element, index, array) {
        $("#select_tipo_art").append(`
            <option value="${element.idTipoArticulo}">${element.descripcion}</option>
        `);
    });

    $("#input_precio").change(()=>{
        $("#select_tipo_cuota").empty();
        precio = parseInt($("#input_precio").val());
        interes = 0;
        no_min = false;

        for (let index = 0; index < tc.length; index++) {
            const element = tc[index];
            if(precio < element.rangoMin && index == 0){
                no_min = true;
                break;
            }
            if (precio >= element.rangoMin) {
                interes = element.interes;
                $("#select_tipo_cuota").empty();

                for (let j = 0; j <= index; j++) {
                    const element_ = tc[j];
                    $("#select_tipo_cuota").append(`
                        <option value="${element.idCuotas}">${element_.meses}</option>
                    `);
                }

            }
        }
        
        cuotas =  parseInt($('select[id="select_tipo_cuota"] option:selected').text());
        if (!no_min) {
            calc(interes, cuotas, precio)
        }
        else{
            $("#label_interes").html(`Interes`);
            $("#txt_interes").val('');
            $("#txt_total").val('');
            $("#txt_mes").val('');
        }
    });
    
    $("#select_tipo_cuota").change(()=>{
        cuotas =  parseInt($('select[id="select_tipo_cuota"] option:selected').text());
        calc(interes, cuotas, precio);
    });
}

document.getElementById('form_newArticulA').addEventListener('submit', e => {
    e.preventDefault();
    var formData = new FormData(e.target)
    var canidad_cuotas = $("#select_tipo_cuota option:selected").text();
    formData.append('op',2);
    formData.append('cantidad_cuotas', canidad_cuotas);

    //console.log(Object.fromEntries(formData));

    $.ajax({
        type: 'POST',
        url: '/bk_empeno',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response) {
            Swal.fire({
                icon: 'success',
                title: 'Formulario Enviado!',
                text: 'Su Solcitud ha sido enviada con exito.',

            }).finally(() => {
                enviarParametro(6);
            });
        },
        error: function(error) {
            Swal.fire({
                icon: 'error',
                title: `Oops...!`,
                html: `<ol class="list-group">${error}</ol>`
            });
        }
    });
});

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


$("#input_images").change(()=>{
    previsualizarImagenes();
});


function previsualizarImagenes() {
    const imagenesInput = document.getElementById('input_images');
    const contenedor = document.getElementById('prev_images');
    
    contenedor.innerHTML = ''; // Limpiar cualquier previsualización anterior
    
    if (imagenesInput.files && imagenesInput.files.length > 0) {
        if (imagenesInput.files.length > 4) {
            Swal.fire({
                icon: 'error',
                title: `Oops...!`,
                html: `<ol class="list-group"><li class="list-group-item list-group-item-action list-group-item-warning"><b>No puedes subir más de 4 imágenes.</b></li></ol>`

            });
            imagenesInput.value = ''; // Borra los archivos seleccionados
            load_log();
            return;
        }
        
        for (let i = 0; i < imagenesInput.files.length; i++) {
            
            $("#prev_images").append(`<div class="col-md-6" id="img_${i}"></div>`);
            const imagenesPrevia = document.getElementById(`img_${i}`);
            const lector = new FileReader();
            const imagen = document.createElement('img');
            imagen.classList.add('img-fluid');
            imagen.classList.add('max-width-100');

            lector.onload = function(e) {
                imagen.src = e.target.result;
                imagenesPrevia.appendChild(imagen);
            };
            
            lector.readAsDataURL(imagenesInput.files[i]);
        }
    }
    else{
        load_log();
    }
}