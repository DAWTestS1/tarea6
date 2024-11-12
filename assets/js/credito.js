document.addEventListener("DOMContentLoaded", function() {
    $(document).ready(inicializarSlider);
    cargarDatosFormulario();
});

function inicializarSlider() {
    var slider = document.getElementById("inputPlazo");
    slider.value = 1; 
    var span = document.getElementById("slider-label");

    // Calcula y establece el estilo inicial del margen
    actualizarPosicionLabel(slider, span);

    // Actualiza el label al mover el slider
    slider.oninput = function() {
        actualizarPosicionLabel(slider, span);
    };
}

function actualizarPosicionLabel(slider, span) {
    var marginValue = parseInt(slider.value) * 5 - 4;
    if (parseInt(slider.value) == 20) {
        marginValue -= 6;
        if (screen.width < 993) {
            marginValue -= 6;
        }
    }
    
    var _yrsTxt = parseInt(slider.value) < 2 ? "año" : "años";
    span.setAttribute('style', 'margin-left:' + marginValue + '%;');
    span.innerHTML = slider.value + " " + _yrsTxt;
}

function calcMontoMaximo(){
    //Obtener el valor de la vivienda
    var valorVivienda = parseFloat(document.getElementById('inputValorVivienda').value) || 0;

    //Calcular el 80% del valor de la vivienda, máximo permitido a solicitar
    var montoMaximo = valorVivienda * 0.8;
    document.getElementById('inputMontoASolicitar').value='';
    document.getElementById('inputMontoASolicitar').max=montoMaximo;
    document.getElementById('montoMaximoLabel').textContent = `Máximo: ${montoMaximo.toFixed(2)}`;
}

function validarMontoASolicitar(){
    var montoASolicitar = parseFloat(document.getElementById('inputMontoASolicitar').value)||0;
    var maximoPermitido = parseFloat(document.getElementById('inputMontoASolicitar').max)||0;

    if(montoASolicitar>maximoPermitido){
        alert('El monto a solicitar no puede superar el 80% del valor de la vivienda');
        document.getElementById('inputMontoASolicitar').value = maximoPermitido;
    }
}
var pagoMensual;



function calculoPagoMensual(){
    var montoSolicitado = document.getElementById('inputMontoASolicitar').value;
    var tasaInteresMensual = document.getElementById('inputInteresAnual').value/12;
    var plazoMeses = document.getElementById('inputPlazo').value*12;

    pagoMensual = montoSolicitado *(tasaInteresMensual/100)*Math.pow(1 + (tasaInteresMensual / 100), plazoMeses);
    pagoMensual = pagoMensual / (Math.pow(1 + (tasaInteresMensual / 100), plazoMeses) - 1);

    // Truncar a 2 decimales
    var decimales = 2;
    var factor = Math.pow(10, decimales);  // Factor para truncar
    pagoMensual = Math.floor(pagoMensual * factor) / factor;  // Truncamos


    document.getElementById('inputPagoMensual').value=pagoMensual;
}
var salarioRequerido;
function calculoSalarioMinimoRequerido(){
    salarioRequerido=pagoMensual/0.40; 

    var decimales = 2;
    var factor = Math.pow(10, decimales);  // Factor para truncar
    salarioRequerido = Math.floor(salarioRequerido * factor)/factor;
    document.getElementById('inputSalarioRequerido').value=salarioRequerido;
}

function calculoEdadYSalario(){
    var salarioNeto = document.getElementById('inputSalarioN').value;
    const fechaActual = new Date();
    var edad = fechaActual.getFullYear() - parseInt(document.getElementById('inputFechaNacimiento').value);
    if(salarioNeto>= salarioRequerido){
        document.getElementById('outputCondicionSalario').value='Monto de salario suficiente para el crédito';
    }else{
        document.getElementById('outputCondicionSalario').value='Monto de salario insuficiente para el crédito';
    }

    if(edad>22 && edad<55){
        document.getElementById('outputCondicionEdad').value='Cliente con edad suficiente para crédito';
    }
    else{
        document.getElementById('outputCondicionEdad').value='Cliente no califica para crédito por edad';
    }
}

function calcPorcentajeAFinanciar(){
    var valorVivienda = parseFloat(document.getElementById('inputValorVivienda').value) || 0;
    var montoASolicitar = parseFloat(document.getElementById('inputMontoASolicitar').value)||0;
    
    var porcentajeFinanciado= (montoASolicitar/valorVivienda)*100;

    var decimales = 2;
    var factor = Math.pow(10, decimales);  // Factor para truncar
    porcentajeFinanciado = Math.floor(porcentajeFinanciado*factor)/factor;
    document.getElementById('outputPorcentajeAFinanciar').value= porcentajeFinanciado + '%';
}

function calculos(){
    calculoPagoMensual();
    calculoSalarioMinimoRequerido();
    calculoEdadYSalario();
    calcPorcentajeAFinanciar();
    guardarDatos()
}

// Función para guardar datos en LocalStorage
function guardarDatos() {
    const datosFormulario = {
        nombre: document.getElementById('inputNombre').value,
        email: document.getElementById('inputEmail').value,
        valorVivienda: document.getElementById('inputValorVivienda').value,
        montoASolicitar: document.getElementById('inputMontoASolicitar').value,
        interesAnual: document.getElementById('inputInteresAnual').value,
        plazo: document.getElementById('inputPlazo').value,
        salarioNeto: document.getElementById('inputSalarioN').value,
        fechaNacimiento: document.getElementById('inputFechaNacimiento').value
    };

    localStorage.setItem('datosFormulario', JSON.stringify(datosFormulario));
}

// Función para cargar los datos desde LocalStorage
function cargarDatosFormulario() {
    // Verificamos si los datos están almacenados en LocalStorage
    const datos = localStorage.getItem('datosFormulario');
    if (datos) {
        // Parseamos los datos almacenados
        const datosFormulario = JSON.parse(datos);

        // Rellenamos los campos del formulario con los datos cargados
        document.getElementById('inputNombre').value = datosFormulario.nombre;
        document.getElementById('inputEmail').value = datosFormulario.email;
        document.getElementById('inputValorVivienda').value = datosFormulario.valorVivienda;
        document.getElementById('inputMontoASolicitar').value = datosFormulario.montoASolicitar;
        document.getElementById('inputInteresAnual').value = datosFormulario.interesAnual;
        document.getElementById('inputPlazo').value = datosFormulario.plazo;
        document.getElementById('inputSalarioN').value = datosFormulario.salarioNeto;
        document.getElementById('inputFechaNacimiento').value = datosFormulario.fechaNacimiento;
    }
}

function mostrarProyeccion() {
    const montoSolicitado = parseFloat(document.getElementById('inputMontoASolicitar').value) || 0;
    const tasaInteresMensual = parseFloat(document.getElementById('inputInteresAnual').value) / 12;
    const plazoMeses = parseInt(document.getElementById('inputPlazo').value) * 12;
    calculos()
    if (!montoSolicitado || !tasaInteresMensual || !plazoMeses) {
        alert("Por favor complete todos los campos necesarios.");
        return;
    }

    let tabla = `
        <table class="table table-striped table-hover table-bordered mt-4">
            <thead class="table-dark">
                <tr>
                    <th>Mes</th>
                    <th>Pago Mensual</th>
                    <th>Intereses</th>
                    <th>Amortización</th>
                    <th>Saldo</th>
                </tr>
            </thead>
            <tbody>
    `;

    let saldo = montoSolicitado;
    for (let mes = 1; mes <= plazoMeses; mes++) {
        const interesMes = saldo * (tasaInteresMensual / 100);
        const amortizacion = pagoMensual - interesMes;
        saldo -= amortizacion;

        const pagoMensualRedondeado = pagoMensual.toFixed(2);
        const interesRedondeado = interesMes.toFixed(2);
        const amortizacionRedondeada = amortizacion.toFixed(2);
        const saldoRedondeado = saldo.toFixed(2);

        tabla += `
            <tr>
                <td>${mes}</td>
                <td>${pagoMensualRedondeado}</td>
                <td>${interesRedondeado}</td>
                <td>${amortizacionRedondeada}</td>
                <td>${saldoRedondeado}</td>
            </tr>
        `;

        if (saldo <= 0) break;
    }

    tabla += `
            </tbody>
        </table>
    `;
    
    document.getElementById('proyeccionPagos').innerHTML = tabla;
}
