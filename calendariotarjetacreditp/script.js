// Variables globales
let fechaActual = new Date(2025, 8, 1); // Septiembre 2025
let fechaInicio = new Date(2025, 8, 1);
let fechaMaxima = new Date(2025 + 1, 8, 1); // 12 meses después
let fechaCorte = 1;
let fechaPago = 14; // Actualizado a 14 según la información del usuario

// Días de la semana en español
const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

// Meses en español
const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

/**
 * Obtiene la lista de días festivos en Colombia para 2025
 * @param {number} year - Año
 * @returns {Array} Array de fechas festivas
 */
function getDiasFestivosColombia(year) {
    return [
        new Date(year, 0, 1),   // Año Nuevo
        new Date(year, 0, 6),   // Reyes Magos
        new Date(year, 2, 24),  // San José
        new Date(year, 3, 13),  // Domingo de Ramos
        new Date(year, 3, 17),  // Jueves Santo
        new Date(year, 3, 18),  // Viernes Santo
        new Date(year, 4, 1),   // Día del Trabajo
        new Date(year, 4, 29),  // Ascensión
        new Date(year, 5, 19),  // Corpus Christi
        new Date(year, 5, 23),  // Sagrado Corazón
        new Date(year, 6, 7),   // San Pedro y San Pablo
        new Date(year, 6, 20),  // Grito de Independencia
        new Date(year, 7, 7),   // Batalla de Boyacá
        new Date(year, 7, 18),  // Asunción de la Virgen
        new Date(year, 9, 13),  // Día de la Raza
        new Date(year, 10, 3),  // Todos los Santos
        new Date(year, 10, 17), // Independencia de Cartagena
        new Date(year, 11, 8),  // Inmaculada Concepción
        new Date(year, 11, 25), // Navidad
    ];
}

/**
 * Calcula la categoría del día según las reglas de tarjeta de crédito
 * @param {Date} fecha - Fecha a evaluar
 * @param {number} diaCorte - Día de corte
 * @param {number} diaPago - Día de pago
 * @returns {Object} Información de la categoría del día
 */
function calcularCategoriaDia(fecha, diaCorte, diaPago) {
    const dia = fecha.getDate();
    let categoria;
    let esCorte = dia === diaCorte;
    let esPago = dia === diaPago;

    // Lógica de categorización actualizada
    if (dia >= (diaCorte + 1) && dia <= diaPago) {
        categoria = 'mejor'; // Del 02 al 14 (máximo plazo)
    } else if (dia >= (diaPago + 1) && dia <= 22) {
        categoria = 'intermedio'; // Del 15 al 22
    } else {
        categoria = 'peor'; // Del 23 al fin de mes y el 01
    }

    return {
        categoria,
        esCorte,
        esPago
    };
}

/**
 * Calcula los días sin interés desde una fecha de compra
 * @param {Date} fechaCompra - Fecha de compra
 * @param {number} diaCorte - Día de corte
 * @param {number} diaPago - Día de pago
 * @returns {number} Días sin interés
 */
function diasSinInteres(fechaCompra, diaCorte, diaPago) {
    const mesCompra = fechaCompra.getMonth();
    const anoCompra = fechaCompra.getFullYear();

    // Determinar el próximo corte
    let fechaCorte;

    // Crear la fecha de corte de este mes
    const corteEsteMes = new Date(anoCompra, mesCompra, diaCorte);

    // Si la fecha de compra es antes o igual al corte de este mes, usamos el corte de este mes
    // Si ya pasó el corte de este mes, usamos el corte del próximo mes
    if (fechaCompra <= corteEsteMes) {
        fechaCorte = corteEsteMes;
    } else {
        fechaCorte = new Date(anoCompra, mesCompra + 1, diaCorte);
    }

    // El pago es siempre el mes siguiente al corte
    const anoCorte = fechaCorte.getFullYear();
    const mesCorte = fechaCorte.getMonth();

    let mesPago = mesCorte + 1;
    let anoPago = anoCorte;

    if (mesPago > 11) {
        mesPago = 0;
        anoPago++;
    }

    const fechaPagoLimite = new Date(anoPago, mesPago, diaPago);
    const diferencia = fechaPagoLimite - fechaCompra;
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
}

/**
 * Verifica si una fecha es día festivo
 * @param {Date} fecha - Fecha a verificar
 * @param {Array} festivos - Array de fechas festivas
 * @returns {boolean} True si es festivo
 */
function esFestivo(fecha, festivos) {
    return festivos.some(festivo =>
        festivo.getDate() === fecha.getDate() &&
        festivo.getMonth() === fecha.getMonth() &&
        festivo.getFullYear() === fecha.getFullYear()
    );
}

/**
 * Renderiza el calendario para el mes actual
 */
function renderCalendario() {
    const calendar = document.getElementById('calendar');
    const monthYear = document.getElementById('monthYear');

    const ano = fechaActual.getFullYear();
    const mes = fechaActual.getMonth();

    // Actualizar título
    monthYear.textContent = `${meses[mes]} ${ano}`;

    // Limpiar calendario
    calendar.innerHTML = '';

    // Agregar encabezados de días
    diasSemana.forEach(dia => {
        const header = document.createElement('div');
        header.className = 'calendar-header';
        header.textContent = dia;
        calendar.appendChild(header);
    });

    // Obtener festivos del año
    const festivosAno = getDiasFestivosColombia(ano);

    // Primer día del mes
    const primerDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);

    // Ajustar para que la semana comience en lunes (0 = lunes, 6 = domingo)
    let diaSemanaInicio = (primerDia.getDay() + 6) % 7;

    // Días del mes anterior para completar la primera semana
    const mesAnterior = new Date(ano, mes, 0);
    for (let i = diaSemanaInicio - 1; i >= 0; i--) {
        const dia = mesAnterior.getDate() - i;
        const fechaDia = new Date(ano, mes - 1, dia);
        crearDiaCalendario(fechaDia, festivosAno, true);
    }

    // Días del mes actual
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
        const fechaDia = new Date(ano, mes, dia);
        crearDiaCalendario(fechaDia, festivosAno, false);
    }

    // Días del mes siguiente para completar la última semana
    const diasMostrados = diaSemanaInicio + ultimoDia.getDate();
    const diasFaltantes = 42 - diasMostrados; // 6 semanas * 7 días
    for (let dia = 1; dia <= diasFaltantes && diasFaltantes < 7; dia++) {
        const fechaDia = new Date(ano, mes + 1, dia);
        crearDiaCalendario(fechaDia, festivosAno, true);
    }

    // Actualizar estado del botón siguiente
    const siguienteMes = document.getElementById('siguienteMes');
    const proximaFecha = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 1);
    siguienteMes.disabled = proximaFecha >= fechaMaxima;
}

/**
 * Crea un elemento de día en el calendario
 * @param {Date} fecha - Fecha del día
 * @param {Array} festivos - Array de fechas festivas
 * @param {boolean} otroMes - Si el día pertenece a otro mes
 */
function crearDiaCalendario(fecha, festivos, otroMes) {
    const calendar = document.getElementById('calendar');
    const dayElement = document.createElement('div');
    const hoy = new Date();

    dayElement.className = 'calendar-day';
    dayElement.setAttribute('tabindex', '0');
    dayElement.setAttribute('role', 'gridcell');
    dayElement.setAttribute('aria-label', `${fecha.getDate()} de ${meses[fecha.getMonth()]} ${fecha.getFullYear()}`);

    if (otroMes) {
        dayElement.classList.add('otros-mes');
    }

    // Número del día
    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = fecha.getDate();
    dayElement.appendChild(dayNumber);

    if (!otroMes) {
        // Calcular categoría del día
        const infoDay = calcularCategoriaDia(fecha, fechaCorte, fechaPago);
        dayElement.classList.add(`categoria-${infoDay.categoria}`);

        if (infoDay.esCorte) {
            dayElement.classList.add('dia-corte');
        }
        if (infoDay.esPago) {
            dayElement.classList.add('dia-pago');
        }

        // Marcar día actual
        if (fecha.toDateString() === hoy.toDateString()) {
            dayElement.classList.add('dia-hoy');
        }

        // Marcar festivos
        if (esFestivo(fecha, festivos)) {
            dayElement.classList.add('dia-festivo');
        }

        // Agregar eventos de tooltip
        dayElement.addEventListener('mouseenter', mostrarTooltip);
        dayElement.addEventListener('mouseleave', ocultarTooltip);
        dayElement.addEventListener('click', toggleTooltip);
        dayElement.addEventListener('focus', mostrarTooltip);
        dayElement.addEventListener('blur', ocultarTooltip);
    }

    calendar.appendChild(dayElement);
}

/**
 * Muestra el tooltip con información del día
 * @param {Event} event - Evento del mouse/focus
 */
function mostrarTooltip(event) {
    const dayElement = event.target.closest('.calendar-day');
    if (dayElement.classList.contains('otros-mes')) return;

    const dayNumber = parseInt(dayElement.querySelector('.day-number').textContent);
    const fecha = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), dayNumber);

    const infoDay = calcularCategoriaDia(fecha, fechaCorte, fechaPago);
    const diasSI = diasSinInteres(fecha, fechaCorte, fechaPago);

    // Calcular fecha de corte y pago usando la misma lógica que diasSinInteres
    const mesCompra = fecha.getMonth();
    const anoCompra = fecha.getFullYear();

    // Determinar el próximo corte usando la misma lógica corregida
    let fechaCorteCalculada;
    const corteEsteMes = new Date(anoCompra, mesCompra, fechaCorte);

    if (fecha <= corteEsteMes) {
        fechaCorteCalculada = corteEsteMes;
    } else {
        fechaCorteCalculada = new Date(anoCompra, mesCompra + 1, fechaCorte);
    }

    // El pago es siempre el mes siguiente al corte
    const anoCorte = fechaCorteCalculada.getFullYear();
    const mesCorte = fechaCorteCalculada.getMonth();

    let mesPago = mesCorte + 1;
    let anoPago = anoCorte;

    if (mesPago > 11) {
        mesPago = 0;
        anoPago++;
    }

    const tooltip = document.getElementById('tooltip');
    tooltip.innerHTML = `
        <strong>Compra este día:</strong><br>
        📌 Corte: ${String(fechaCorte).padStart(2, '0')}/${String(mesCorte + 1).padStart(2, '0')}/${anoCorte}<br>
        💳 Pago: ${String(fechaPago).padStart(2, '0')}/${String(mesPago + 1).padStart(2, '0')}/${anoPago}<br>
        ⏰ Días sin interés: ~${diasSI} días<br>
        📊 Categoría: ${infoDay.categoria === 'mejor' ? '🟢 Mejor' : infoDay.categoria === 'intermedio' ? '🟡 Intermedio' : '🔴 Peor'}
    `;

    // Posicionar tooltip
    const rect = dayElement.getBoundingClientRect();
    tooltip.style.left = `${rect.left + window.scrollX + rect.width / 2 - 125}px`;
    tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 10}px`;

    tooltip.classList.add('visible');
}

/**
 * Oculta el tooltip
 */
function ocultarTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.classList.remove('visible');
}

/**
 * Toggle del tooltip para dispositivos táctiles
 * @param {Event} event - Evento de click
 */
function toggleTooltip(event) {
    const tooltip = document.getElementById('tooltip');
    if (tooltip.classList.contains('visible')) {
        ocultarTooltip();
    } else {
        mostrarTooltip(event);
    }
}

/**
 * Cambia el mes mostrado
 * @param {number} direccion - -1 para anterior, 1 para siguiente
 */
function cambiarMes(direccion) {
    const nuevaFecha = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + direccion, 1);

    // Verificar límites
    if (nuevaFecha < fechaInicio || nuevaFecha >= fechaMaxima) {
        return;
    }

    fechaActual = nuevaFecha;
    renderCalendario();
}

/**
 * Actualiza el calendario con la nueva configuración
 */
function actualizarCalendario() {
    const inputCorte = document.getElementById('fechaCorte');
    const inputPago = document.getElementById('fechaPago');

    fechaCorte = parseInt(inputCorte.value);
    fechaPago = parseInt(inputPago.value);

    // Validación básica
    if (fechaCorte < 1 || fechaCorte > 31 || fechaPago < 1 || fechaPago > 31) {
        alert('Por favor ingrese fechas válidas (1-31)');
        return;
    }

    renderCalendario();
}

// Navegación con teclado
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        cambiarMes(-1);
        event.preventDefault();
    } else if (event.key === 'ArrowRight') {
        cambiarMes(1);
        event.preventDefault();
    }
});

// Eventos de los inputs de configuración
document.getElementById('fechaCorte').addEventListener('change', actualizarCalendario);
document.getElementById('fechaPago').addEventListener('change', actualizarCalendario);

// Inicializar el calendario
window.addEventListener('load', () => {
    renderCalendario();
});
