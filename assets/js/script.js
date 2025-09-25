// Configuración y variables globales
const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

let currentDate = new Date();
let selectedDate = null;
let events = JSON.parse(localStorage.getItem('calendar-events')) || {};

// Elementos del DOM
const elements = {
    currentDateSpan: document.getElementById('current-date'),
    monthYearSpan: document.getElementById('month-year'),
    calendarDays: document.getElementById('calendar-days'),
    prevBtn: document.getElementById('prev-btn'),
    nextBtn: document.getElementById('next-btn'),
    todayBtn: document.getElementById('today-btn'),
    eventModal: document.getElementById('event-modal'),
    eventTitle: document.getElementById('event-title'),
    eventDescription: document.getElementById('event-description'),
    eventTime: document.getElementById('event-time'),
    eventColor: document.getElementById('event-color'),
    saveEventBtn: document.getElementById('save-event'),
    cancelEventBtn: document.getElementById('cancel-event'),
    closeModalBtn: document.getElementById('close-modal')
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeCalendar();
    setupEventListeners();
    updateCurrentDate();
});

// Configurar event listeners
function setupEventListeners() {
    elements.prevBtn.addEventListener('click', () => navigateMonth(-1));
    elements.nextBtn.addEventListener('click', () => navigateMonth(1));
    elements.todayBtn.addEventListener('click', goToToday);
    elements.saveEventBtn.addEventListener('click', saveEvent);
    elements.cancelEventBtn.addEventListener('click', closeModal);
    elements.closeModalBtn.addEventListener('click', closeModal);
    
    // Cerrar modal al hacer click fuera
    elements.eventModal.addEventListener('click', (e) => {
        if (e.target === elements.eventModal) {
            closeModal();
        }
    });

    // Cerrar modal con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.eventModal.classList.contains('show')) {
            closeModal();
        }
    });
}

// Inicializar el calendario
function initializeCalendar() {
    renderCalendar();
    updateCurrentDate();
}

// Actualizar la fecha actual mostrada
function updateCurrentDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    elements.currentDateSpan.textContent = now.toLocaleDateString('es-ES', options);
}

// Navegar entre meses
function navigateMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    renderCalendar();
    animateTransition();
}

// Ir al día de hoy
function goToToday() {
    currentDate = new Date();
    selectedDate = new Date();
    renderCalendar();
    animateTransition();
}

// Renderizar el calendario
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Actualizar el header
    elements.monthYearSpan.textContent = `${monthNames[month]} ${year}`;
    
    // Limpiar días anteriores
    elements.calendarDays.innerHTML = '';
    
    // Obtener primer día del mes y días en el mes
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Días del mes anterior para completar la primera semana
    const prevMonth = new Date(year, month - 1, 0);
    const daysInPrevMonth = prevMonth.getDate();
    
    // Agregar días del mes anterior
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const dayElement = createDayElement(
            daysInPrevMonth - i, 
            month - 1, 
            year, 
            true
        );
        elements.calendarDays.appendChild(dayElement);
    }
    
    // Agregar días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = createDayElement(day, month, year, false);
        elements.calendarDays.appendChild(dayElement);
    }
    
    // Completar con días del mes siguiente
    const totalCells = elements.calendarDays.children.length;
    const remainingCells = 42 - totalCells; // 6 semanas x 7 días
    
    for (let day = 1; day <= remainingCells; day++) {
        const dayElement = createDayElement(
            day, 
            month + 1, 
            year, 
            true
        );
        elements.calendarDays.appendChild(dayElement);
    }
}

// Crear elemento de día
function createDayElement(day, month, year, isOtherMonth) {
    const dayElement = document.createElement('div');
    dayElement.className = 'day';
    dayElement.textContent = day;
    
    const dayDate = new Date(year, month, day);
    const today = new Date();
    const dateKey = `${year}-${month}-${day}`;
    
    // Clases condicionales
    if (isOtherMonth) {
        dayElement.classList.add('other-month');
    }
    
    if (!isOtherMonth && isSameDay(dayDate, today)) {
        dayElement.classList.add('today');
    }
    
    if (selectedDate && isSameDay(dayDate, selectedDate)) {
        dayElement.classList.add('selected');
    }
    
    if (events[dateKey]) {
        dayElement.classList.add('has-event');
        // Agregar tooltip con eventos
        const eventTitles = events[dateKey].map(event => event.title).join(', ');
        dayElement.title = `Eventos: ${eventTitles}`;
    }
    
    // Event listener para seleccionar día
    dayElement.addEventListener('click', () => {
        selectDay(dayDate, dayElement);
    });
    
    // Double click para agregar evento
    dayElement.addEventListener('dblclick', (e) => {
        e.preventDefault();
        selectDay(dayDate, dayElement);
        openEventModal(dayDate);
    });
    
    return dayElement;
}

// Seleccionar un día
function selectDay(date, element) {
    // Remover selección anterior
    document.querySelectorAll('.day.selected').forEach(day => {
        day.classList.remove('selected');
    });
    
    // Agregar nueva selección
    element.classList.add('selected');
    selectedDate = new Date(date);
    
    // Efecto visual
    element.style.transform = 'scale(1.1)';
    setTimeout(() => {
        element.style.transform = '';
    }, 200);
}

// Abrir modal de eventos
function openEventModal(date) {
    selectedDate = date;
    elements.eventTitle.value = '';
    elements.eventDescription.value = '';
    elements.eventTime.value = '';
    elements.eventColor.value = 'blue';
    
    elements.eventModal.classList.add('show');
    elements.eventTitle.focus();
}

// Cerrar modal
function closeModal() {
    elements.eventModal.classList.remove('show');
}

// Guardar evento
function saveEvent() {
    const title = elements.eventTitle.value.trim();
    const description = elements.eventDescription.value.trim();
    const time = elements.eventTime.value;
    const color = elements.eventColor.value;
    
    if (!title) {
        alert('Por favor, ingresa un título para el evento.');
        elements.eventTitle.focus();
        return;
    }
    
    if (!selectedDate) {
        alert('Por favor, selecciona una fecha.');
        return;
    }
    
    const dateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`;
    
    // Crear evento
    const event = {
        id: Date.now(),
        title,
        description,
        time,
        color,
        date: selectedDate.toISOString()
    };
    
    // Agregar al storage
    if (!events[dateKey]) {
        events[dateKey] = [];
    }
    
    events[dateKey].push(event);
    localStorage.setItem('calendar-events', JSON.stringify(events));
    
    // Cerrar modal y actualizar vista
    closeModal();
    renderCalendar();
    
    // Mostrar mensaje de confirmación
    showNotification('Evento guardado correctamente', 'success');
}

// Verificar si dos fechas son el mismo día
function isSameDay(date1, date2) {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
}

// Animación de transición
function animateTransition() {
    elements.calendarDays.style.opacity = '0.7';
    elements.calendarDays.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        elements.calendarDays.style.opacity = '1';
        elements.calendarDays.style.transform = 'scale(1)';
    }, 150);
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Estilos de la notificación
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? '#48bb78' : '#667eea',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        zIndex: '1001',
        animation: 'slideInRight 0.3s ease',
        fontSize: '0.9rem',
        fontWeight: '500'
    });
    
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Funciones adicionales para mejorar la experiencia

// Detectar dispositivos móviles
function isMobile() {
    return window.innerWidth <= 768;
}

// Manejar redimensionamiento de ventana
window.addEventListener('resize', () => {
    // Reajustar calendario en dispositivos móviles
    if (isMobile()) {
        document.body.style.padding = '10px';
    } else {
        document.body.style.padding = '20px';
    }
});

// Atajos de teclado
document.addEventListener('keydown', (e) => {
    if (elements.eventModal.classList.contains('show')) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            navigateMonth(-1);
            break;
        case 'ArrowRight':
            e.preventDefault();
            navigateMonth(1);
            break;
        case 'Home':
            e.preventDefault();
            goToToday();
            break;
        case ' ':
            e.preventDefault();
            goToToday();
            break;
    }
});

// Efecto de hover mejorado para días
document.addEventListener('mouseover', (e) => {
    if (e.target.classList.contains('day') && !e.target.classList.contains('other-month')) {
        e.target.style.transition = 'all 0.2s ease';
    }
});

// Prevenir selección de texto en elementos del calendario
document.addEventListener('selectstart', (e) => {
    if (e.target.closest('.calendar-container')) {
        e.preventDefault();
    }
});

// Agregar estilos CSS para las animaciones de notificación
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
    
    .calendar-days {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
`;
document.head.appendChild(notificationStyles);

// Debug: Mostrar información del calendario en consola
console.log('🗓️ RAJL Calendar inicializado correctamente');
console.log('📅 Características disponibles:');
console.log('   • Navegación con flechas del teclado');
console.log('   • Doble click para agregar eventos');
console.log('   • Almacenamiento local de eventos');
console.log('   • Diseño responsive');
console.log('   • Atajos de teclado (Inicio/Espacio para hoy)');