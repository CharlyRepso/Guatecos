$('#principal_dom').addClass('justify-content-center align-self-center d-flex');



$("#btn_registro").click(function () {
    var data = [];
    var flag = true;

    $(".form-control").each(function(index, element) {
        var value = $(element).val();
        if (value != "") {
            data.push(value);
            $(element).removeClass("errorEmpty");
        }else{
            flag = false;
            $(element).addClass("errorEmpty");
        }
    })

    if (flag) {
        var user = {
            firstName: data[0],
            lastName: data[1],
            username: data[2],
            password: data[3],
            email: data[4],
            phone: data[5],
            address: data[6],
        }

        termsAndConditions();
        $("#checkTermsAndCoditions").click(function () {
            if( $('#checkTermsAndCoditions').is(':checked') ) {
                $('#sendAcept').attr('disabled', false);
            } else {
                $('#sendAcept').attr('disabled', true);
            }
        });

        $("#sendAcept").click(()=>{
            var message = "";
            $.ajax({
                url: '/bk_registrarUser', // Cambia la URL según tu configuración
                method: 'POST',
                async: true,
                data: user,
                success: function(data) {
                    console.log(data);
                    if (data.userName) {
                        message +=`<li class="list-group-item list-group-item-action list-group-item-warning">El <b>nombre de usuario</b> ya esta en uso, <b>escoja otro nombre.</b></li>`;
                    }
                    if (data.email) {
                        message += `<li class="list-group-item list-group-item-action list-group-item-warning">El <b>correo electronico</b> ingresado ya esta siendo utilizado, <b>ingrese otro.</b></li>`;
                    }
                    if (data.registro) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Usuario creado exitosamente!',
                            text: 'Se ha enviado un correo electronico con sus credenciales.',

                        }).finally(() => {
                            enviarParametro(1);
                          });
                    }else{
                        Swal.fire({
                            icon: 'error',
                            title: `Oops...!`,
                            html: `<ol class="list-group">${message}</ol>`
                        });
                    }
                },
                error: function(error) {
                    console.error('Error en la solicitud AJAX:', error);
                }
            });
        });
    }
    else{
        Swal.fire({
            icon: 'error',
            title: 'Oops...!',
            text: 'Debe de llenar todos los campos',
          })
    }
});

function termsAndConditions() {
    var acept = false;

    $("#lg_modal_title").html(
        `Términos y Condiciones`
    );
    
    $("#lg_modal_content").html(`
        <h5 class="fw-bold text-center">Términos y Condiciones de Empeño</h5>
        <p>Fecha de entrada en vigor: 01 de septiembre de 2023</p>
        <h5 class = "fw-bold text-center">Aceptación de los Términos</h5>
        <p>Al utilizar los servicios de empeño proporcionados en este sitio web, acepta los siguientes términos y condiciones. Si no está de acuerdo con alguno de los términos, no utilice este servicio.</p>
        <h5 class = "fw-bold text-center">Descripción de los Servicios de Empeño</h5>
        <ol class="list-group list-group-numbered">
        <li class="list-group-item">Ofrecemos servicios de empeño a individuos que desean obtener préstamos utilizando sus artículos personales como garantía.</li>
        <li class="list-group-item">Los artículos empeñados deben ser propiedad del cliente y estar en condiciones adecuadas para su empeño.</p></li>
        <li class="list-group-item">Los términos del empeño, incluidas las tasas de interés, los plazos de reembolso y los valores de los artículos, se acordarán en el momento de la transacción</li>
        </ol>
        <h5 class = "fw-bold text-center">Condiciones de Empeño</h5>
        <ol class="list-group list-group-numbered">
        <li class="list-group-item">Los artículos empeñados estarán sujetos a un período de empeño que se acordará entre el cliente y GUATECOS. El cliente NO tendrá la opción de extender el período de empeño.</li>
        <li class="list-group-item">Después de tres cuotas vencidas sin pago o acuerdo de extensión, GUATECOS se reserva el derecho de considerar los artículos empeñados como propiedad de GUATECOS y proceder a su venta o disposición.</p></li>
        </ol>
        <h5 class = "fw-bold text-center">Tarifas e Interes</h5>
        <p>Se aplicarán tarifas de empeño y tasas de interés según lo acordado en el contrato de empeño, este se determinara por la cantidad de tiempo y dinero solicitado por el articulo</p>
        <h5 class = "fw-bold text-center">Privacidad y Seguridad</h5>
        <p>GUATECOS se compromete a proteger la privacidad y la seguridad de la información personal proporcionada por los clientes de acuerdo con nuestra Política de Privacidad.</p>
        <h5 class = "fw-bold text-center">Ley Aplicable</h5>
        <p>Estos términos y condiciones se regirán e interpretarán de acuerdo con las leyes del país y cualquier disputa que surja en relación con estos términos estará sujeta a la jurisdicción exclusiva de los tribunales de la Republica de Guatemala.</p>
        <p>GUATECOS se reserva el derecho de modificar estos términos y condiciones en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en este sitio web.</p>
    `);
    $("#lg_modal_footer").html(`
        <div class="row" style="width: 100%">
            <div class="col-6 text-start">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="checkTermsAndCoditions">
                    <label class="form-check-label" for="checkTermsAndCoditions">
                        Acepto los términos y condiciones
                    </label>
                </div>
            </div>
            <div class="col-6 text-end">
                <button type="button" class="btn btn-danger" id="sendAcept" disabled>Acepto</button>
            </div>
        </div>
    `)
    $("#lg_modal").modal("show");
}
    