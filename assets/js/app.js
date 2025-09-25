/* ===================================
   RAJL Calendar - Archivo Principal
   =================================== */

// Utilidades simplificadas integradas
const DateUtils = {
    formatCurrentDate: () => {
        const today = new Date();
        return today.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    formatMonthYear: (date) => {
        return date.toLocaleDateString('es-ES', {
            month: 'long',
            year: 'numeric'
        });
    },
    formatDateKey: (date) => {
        return date.toISOString().split('T')[0];
    },
    formatDisplayDate: (date) => {
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    },
    parseDate: (dateKey) => {
        return new Date(dateKey + 'T00:00:00');
    },
    isSameDay: (date1, date2) => {
        return date1.toDateString() === date2.toDateString();
    }
};

const DOMUtils = {
    $: (selector) => document.querySelector(selector),
    sanitizeHTML: (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};

const AnimationUtils = {
    fadeIn: (element) => {
        element.style.display = 'flex';
        element.style.opacity = '0';
        setTimeout(() => {
            element.style.transition = 'opacity 0.3s ease';
            element.style.opacity = '1';
        }, 10);
    },
    fadeOut: (element) => {
        element.style.transition = 'opacity 0.3s ease';
        element.style.opacity = '0';
        setTimeout(() => {
            element.style.display = 'none';
        }, 300);
    }
};

// EventManager simplificado
class EventManager {
    constructor() {
        this.storageKey = 'rajl-calendar-events';
    }

    getAllEvents() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey)) || {};
        } catch {
            return {};
        }
    }

    getEventsForDate(date) {
        const dateKey = DateUtils.formatDateKey(date);
        const allEvents = this.getAllEvents();
        return allEvents[dateKey] || [];
    }

    createEvent(dateKey, eventData) {
        try {
            const allEvents = this.getAllEvents();
            if (!allEvents[dateKey]) {
                allEvents[dateKey] = [];
            }
            
            const event = {
                id: Date.now().toString(),
                ...eventData,
                createdAt: new Date().toISOString()
            };
            
            allEvents[dateKey].push(event);
            localStorage.setItem(this.storageKey, JSON.stringify(allEvents));
            return true;
        } catch {
            return false;
        }
    }

    updateEvent(dateKey, eventId, eventData) {
        try {
            const allEvents = this.getAllEvents();
            if (!allEvents[dateKey]) return false;
            
            const eventIndex = allEvents[dateKey].findIndex(e => e.id === eventId);
            if (eventIndex === -1) return false;
            
            allEvents[dateKey][eventIndex] = {
                ...allEvents[dateKey][eventIndex],
                ...eventData,
                updatedAt: new Date().toISOString()
            };
            
            localStorage.setItem(this.storageKey, JSON.stringify(allEvents));
            return true;
        } catch {
            return false;
        }
    }

    deleteEvent(dateKey, eventId) {
        try {
            const allEvents = this.getAllEvents();
            if (!allEvents[dateKey]) return false;
            
            allEvents[dateKey] = allEvents[dateKey].filter(e => e.id !== eventId);
            if (allEvents[dateKey].length === 0) {
                delete allEvents[dateKey];
            }
            
            localStorage.setItem(this.storageKey, JSON.stringify(allEvents));
            return true;
        } catch {
            return false;
        }
    }

    getEvent(dateKey, eventId) {
        const allEvents = this.getAllEvents();
        if (!allEvents[dateKey]) return null;
        return allEvents[dateKey].find(e => e.id === eventId) || null;
    }

    clearAllEvents() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch {
            return false;
        }
    }

    cleanOldEvents() {
        // Por ahora no limpiamos eventos antiguos
    }

    getStatistics() {
        const allEvents = this.getAllEvents();
        const totalEvents = Object.values(allEvents).reduce((total, events) => total + events.length, 0);
        return {
            totalEvents,
            totalDays: Object.keys(allEvents).length
        };
    }
}

// NotificationManager simplificado
class NotificationManager {
    success(message) {
        this.show(message, 'success');
    }

    error(message) {
        this.show(message, 'error');
    }

    info(message) {
        this.show(message, 'info');
    }

    show(message, type = 'info') {
        // Crear notificación simple
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        if (type === 'success') {
            notification.style.background = '#059669';
        } else if (type === 'error') {
            notification.style.background = '#dc2626';
        } else {
            notification.style.background = '#2563eb';
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

class RAJLCalendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.eventManager = new EventManager();
        this.notificationManager = new NotificationManager();
        
        // Referencias a elementos del DOM
        this.elements = this.getElements();
        
        // Inicializar
        this.init();
    }

    /**
     * Obtiene referencias a elementos del DOM
     * @returns {Object}
     */
    getElements() {
        return {
            currentDateSpan: DOMUtils.$('#current-date'),
            monthYearSpan: DOMUtils.$('#month-year'),
            calendarDays: DOMUtils.$('#calendar-days'),
            prevBtn: DOMUtils.$('#prev-btn'),
            nextBtn: DOMUtils.$('#next-btn'),
            todayBtn: DOMUtils.$('#today-btn'),
            eventModal: DOMUtils.$('#event-modal'),
            eventListModal: DOMUtils.$('#event-list-modal'),
            eventTitle: DOMUtils.$('#event-title'),
            eventDescription: DOMUtils.$('#event-description'),
            eventTime: DOMUtils.$('#event-time'),
            eventColor: DOMUtils.$('#event-color'),
            saveEventBtn: DOMUtils.$('#save-event'),
            cancelEventBtn: DOMUtils.$('#cancel-event'),
            closeModalBtn: DOMUtils.$('#close-modal'),
            closeEventListBtn: DOMUtils.$('#close-event-list-modal'),
            eventsList: DOMUtils.$('#events-list'),
            selectedDateSpan: DOMUtils.$('#selected-date'),
            addEventBtn: DOMUtils.$('#add-event-btn'),
            viewAllEventsBtn: DOMUtils.$('#view-all-events-btn'),
            deleteAllEventsBtn: DOMUtils.$('#delete-all-events-btn'),
            allEventsModal: DOMUtils.$('#all-events-modal'),
            closeAllEventsBtn: DOMUtils.$('#close-all-events-modal'),
            allEventsList: DOMUtils.$('#all-events-list'),
            noEventsMessage: DOMUtils.$('#no-events-message'),
            confirmDeleteModal: DOMUtils.$('#confirm-delete-modal'),
            cancelDeleteBtn: DOMUtils.$('#cancel-delete'),
            confirmDeleteBtn: DOMUtils.$('#confirm-delete')
        };
    }

    /**
     * Inicializa el calendario
     */
    init() {
        this.setupEventListeners();
        this.renderCalendar();
        this.updateCurrentDate();
        this.logInitialization();
        
        // Limpiar eventos antiguos al inicializar
        this.eventManager.cleanOldEvents();
    }

    /**
     * Configura los event listeners
     */
    setupEventListeners() {
        // Navegación
        if (this.elements.prevBtn) this.elements.prevBtn.addEventListener('click', () => this.navigateMonth(-1));
        if (this.elements.nextBtn) this.elements.nextBtn.addEventListener('click', () => this.navigateMonth(1));
        if (this.elements.todayBtn) this.elements.todayBtn.addEventListener('click', () => this.goToToday());
        
        // Modal de eventos
        if (this.elements.saveEventBtn) this.elements.saveEventBtn.addEventListener('click', () => this.saveEvent());
        if (this.elements.cancelEventBtn) this.elements.cancelEventBtn.addEventListener('click', () => this.closeModal());
        if (this.elements.closeModalBtn) this.elements.closeModalBtn.addEventListener('click', () => this.closeModal());
        
        // Modal de lista de eventos
        if (this.elements.closeEventListBtn) this.elements.closeEventListBtn.addEventListener('click', () => this.closeEventListModal());
        if (this.elements.addEventBtn) this.elements.addEventBtn.addEventListener('click', () => this.openEventModalFromList());
        
        // Botones de acciones
        if (this.elements.viewAllEventsBtn) this.elements.viewAllEventsBtn.addEventListener('click', () => this.viewAllEvents());
        if (this.elements.deleteAllEventsBtn) this.elements.deleteAllEventsBtn.addEventListener('click', () => this.deleteAllEvents());
        if (this.elements.closeAllEventsBtn) this.elements.closeAllEventsBtn.addEventListener('click', () => this.closeAllEventsModal());
        
        // Modal de confirmación
        if (this.elements.cancelDeleteBtn) this.elements.cancelDeleteBtn.addEventListener('click', () => this.closeModal(this.elements.confirmDeleteModal));
        if (this.elements.confirmDeleteBtn) this.elements.confirmDeleteBtn.addEventListener('click', () => this.confirmDeleteAllEvents());
        
        // Cerrar modal con click fuera
        if (this.elements.eventModal) {
            this.elements.eventModal.addEventListener('click', (e) => {
                if (e.target === this.elements.eventModal) {
                    this.closeModal();
                }
            });
        }

        if (this.elements.eventListModal) {
            this.elements.eventListModal.addEventListener('click', (e) => {
                if (e.target === this.elements.eventListModal) {
                    this.closeEventListModal();
                }
            });
        }

        if (this.elements.allEventsModal) {
            this.elements.allEventsModal.addEventListener('click', (e) => {
                if (e.target === this.elements.allEventsModal) {
                    this.closeAllEventsModal();
                }
            });
        }

        if (this.elements.confirmDeleteModal) {
            this.elements.confirmDeleteModal.addEventListener('click', (e) => {
                if (e.target === this.elements.confirmDeleteModal) {
                    this.closeModal(this.elements.confirmDeleteModal);
                }
            });
        }

        // Atajos de teclado
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    /**
     * Maneja las teclas del teclado
     * @param {KeyboardEvent} event
     */
    handleKeyPress(event) {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return; // No manejar atajos si está escribiendo
        }

        switch (event.key) {
            case 'ArrowLeft':
                this.navigateMonth(-1);
                event.preventDefault();
                break;
            case 'ArrowRight':
                this.navigateMonth(1);
                event.preventDefault();
                break;
            case 'Home':
            case ' ':
                this.goToToday();
                event.preventDefault();
                break;
            case 'Escape':
                this.closeModal();
                break;
        }
    }

    /**
     * Navega entre meses
     * @param {number} direction
     */
    navigateMonth(direction) {
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        this.renderCalendar();
    }

    /**
     * Va al día de hoy
     */
    goToToday() {
        this.currentDate = new Date();
        this.renderCalendar();
        this.updateCurrentDate();
        this.notificationManager.info('Navegando a hoy');
    }

    /**
     * Actualiza la fecha actual mostrada
     */
    updateCurrentDate() {
        if (this.elements.currentDateSpan) {
            this.elements.currentDateSpan.textContent = DateUtils.formatCurrentDate();
        }
    }

    /**
     * Renderiza el calendario
     */
    renderCalendar() {
        this.renderMonthYear();
        this.renderDays();
    }

    /**
     * Renderiza el mes y año actual
     */
    renderMonthYear() {
        if (this.elements.monthYearSpan) {
            this.elements.monthYearSpan.textContent = DateUtils.formatMonthYear(this.currentDate);
        }
    }

    /**
     * Renderiza los días del calendario
     */
    renderDays() {
        if (!this.elements.calendarDays) return;

        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        let html = '';
        let currentDate = new Date(startDate);

        for (let week = 0; week < 6; week++) {
            for (let day = 0; day < 7; day++) {
                const dayClass = this.getDayClass(currentDate, firstDay, lastDay);
                const dayEvents = this.eventManager.getEventsForDate(currentDate);
                const hasEvents = dayEvents.length > 0;
                
                const eventIndicators = hasEvents ? dayEvents.slice(0, 3).map(event => 
                    `<div class="event-dot" style="background-color: ${event.color || '#2563eb'}"></div>`
                ).join('') : '';
                
                html += `
                    <div class="day ${dayClass}" data-date="${DateUtils.formatDateKey(currentDate)}">
                        <span class="day-number">${currentDate.getDate()}</span>
                        ${hasEvents ? `<div class="event-indicators">${eventIndicators}${dayEvents.length > 3 ? '<div class="event-more">+' + (dayEvents.length - 3) + '</div>' : ''}</div>` : ''}
                    </div>
                `;
                
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }

        this.elements.calendarDays.innerHTML = html;
        this.setupDayClickEvents();
    }

    /**
     * Obtiene las clases CSS para un día
     * @param {Date} date
     * @param {Date} firstDay
     * @param {Date} lastDay
     * @returns {string}
     */
    getDayClass(date, firstDay, lastDay) {
        const today = new Date();
        let classes = [];

        if (date < firstDay || date > lastDay) {
            classes.push('other-month');
        }

        if (DateUtils.isSameDay(date, today)) {
            classes.push('today');
        }

        if (this.selectedDate && DateUtils.isSameDay(date, this.selectedDate)) {
            classes.push('selected');
        }

        return classes.join(' ');
    }

    /**
     * Configura los eventos de click en los días
     */
    setupDayClickEvents() {
        const dayElements = this.elements.calendarDays.querySelectorAll('.day');
        
        dayElements.forEach(dayEl => {
            let clickTimeout;
            
            dayEl.addEventListener('click', () => {
                const dateKey = dayEl.dataset.date;
                
                // Limpiar timeout previo
                if (clickTimeout) {
                    clearTimeout(clickTimeout);
                    clickTimeout = null;
                    // Es doble click - crear evento directamente
                    this.selectedDate = DateUtils.parseDate(dateKey);
                    this.updateSelectedDay(dayEl);
                    this.openEventModal(dateKey);
                    return;
                }
                
                // Primer click - esperar por posible doble click
                clickTimeout = setTimeout(() => {
                    clickTimeout = null;
                    this.handleDayClick(dateKey, dayEl);
                }, 300);
            });
        });
    }

    /**
     * Actualiza el día seleccionado visualmente
     * @param {HTMLElement} dayElement 
     */
    updateSelectedDay(dayElement) {
        this.elements.calendarDays.querySelectorAll('.day').forEach(day => {
            day.classList.remove('selected');
        });
        dayElement.classList.add('selected');
    }

    /**
     * Maneja el click en un día
     * @param {string} dateKey
     * @param {HTMLElement} dayElement
     */
    handleDayClick(dateKey, dayElement) {
        // Actualizar fecha seleccionada
        this.selectedDate = DateUtils.parseDate(dateKey);
        this.updateSelectedDay(dayElement);

        // Verificar si hay eventos en este día
        const events = this.eventManager.getEventsForDate(this.selectedDate);
        
        if (events.length > 0) {
            this.showDayEvents(dateKey, events);
        }
        // Si no hay eventos, no hacer nada (solo seleccionar el día)
    }

    /**
     * Muestra los eventos de un día específico
     * @param {string} dateKey
     * @param {Array} events
     */
    showDayEvents(dateKey, events) {
        if (!this.elements.eventListModal) return;

        // Actualizar fecha seleccionada en el modal
        if (this.elements.selectedDateSpan) {
            this.elements.selectedDateSpan.textContent = this.formatDateKey(dateKey);
        }

        // Renderizar eventos
        this.renderEventsList(events);

        // Mostrar modal
        this.openModal(this.elements.eventListModal);
    }

    /**
     * Renderiza la lista de eventos
     * @param {Array} events
     */
    renderEventsList(events) {
        if (!this.elements.eventsList) return;

        this.elements.eventsList.innerHTML = events.map(event => `
            <div class="event-item" style="border-left-color: ${this.getColorValue(event.color)}">
                <div class="event-item-header">
                    <h4 class="event-item-title">${DOMUtils.sanitizeHTML(event.title)}</h4>
                    <span class="event-item-time">
                        ${event.time ? DOMUtils.sanitizeHTML(event.time) : 'Todo el día'}
                    </span>
                </div>
                ${event.description ? `
                    <p class="event-item-description">${DOMUtils.sanitizeHTML(event.description)}</p>
                ` : ''}
                <div class="event-item-actions">
                    <button class="btn btn-small btn-secondary" onclick="window.rajlCalendar.editEvent('${event.id}')">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-small btn-danger" onclick="window.rajlCalendar.deleteEvent('${event.id}')">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Abre el modal de evento
     * @param {string} dateKey
     */
    openEventModal(dateKey = null) {
        if (!this.elements.eventModal) return;

        // Si no se especifica fecha, usar la seleccionada
        if (!dateKey && this.selectedDate) {
            dateKey = DateUtils.formatDateKey(this.selectedDate);
        }

        // Limpiar formulario
        this.clearEventForm();

        // Guardar la fecha para el evento
        this.elements.eventModal.dataset.dateKey = dateKey;

        // Mostrar modal
        this.openModal(this.elements.eventModal);

        // Enfocar el campo título
        if (this.elements.eventTitle) {
            setTimeout(() => this.elements.eventTitle.focus(), 100);
        }
    }

    /**
     * Abre el modal de evento desde la lista
     */
    openEventModalFromList() {
        const dateKey = DateUtils.formatDateKey(this.selectedDate);
        this.closeEventListModal();
        this.openEventModal(dateKey);
    }

    /**
     * Limpia el formulario de evento
     */
    clearEventForm() {
        if (this.elements.eventTitle) this.elements.eventTitle.value = '';
        if (this.elements.eventDescription) this.elements.eventDescription.value = '';
        if (this.elements.eventTime) this.elements.eventTime.value = '';
        
        // Limpiar selección de color
        const colorOptions = document.querySelectorAll('.color-option');
        colorOptions.forEach(option => option.classList.remove('selected'));
        
        // Seleccionar color por defecto (azul)
        const defaultColor = document.querySelector('.color-option[data-color="#2563eb"]');
        if (defaultColor) {
            defaultColor.classList.add('selected');
        }
    }

    /**
     * Guarda un evento (crear o editar)
     */
    saveEvent() {
        const dateKey = this.elements.eventModal.dataset.dateKey;
        if (!dateKey) {
            this.notificationManager.error('Error: Fecha no especificada');
            return;
        }

        const title = this.elements.eventTitle?.value?.trim();
        if (!title) {
            this.notificationManager.error('El título del evento es obligatorio');
            this.elements.eventTitle?.focus();
            return;
        }

        const selectedColor = document.querySelector('.color-option.selected');
        const eventData = {
            title,
            description: this.elements.eventDescription?.value?.trim() || '',
            time: this.elements.eventTime?.value || '',
            color: selectedColor?.dataset.color || '#2563eb',
            date: dateKey
        };

        const isEditMode = this.elements.eventModal.dataset.editMode === 'true';
        const eventId = this.elements.eventModal.dataset.eventId;

        let success;
        if (isEditMode && eventId) {
            // Actualizar evento existente
            success = this.eventManager.updateEvent(dateKey, eventId, eventData);
        } else {
            // Crear nuevo evento
            success = this.eventManager.createEvent(dateKey, eventData);
        }
        
        if (success) {
            this.closeModal();
            this.renderCalendar();
            
            const message = isEditMode ? 'Evento actualizado correctamente' : 'Evento creado correctamente';
            this.notificationManager.success(message);
        } else {
            const message = isEditMode ? 'Error al actualizar el evento' : 'Error al crear el evento';
            this.notificationManager.error(message);
        }
    }

    /**
     * Muestra todos los eventos en un modal
     */
    viewAllEvents() {
        const allEvents = this.eventManager.getAllEvents();
        const eventsList = this.elements.allEventsList;
        const noEventsMessage = this.elements.noEventsMessage;
        
        // Limpiar lista
        eventsList.innerHTML = '';
        
        // Contar total de eventos
        const totalEvents = Object.values(allEvents).reduce((total, events) => total + events.length, 0);
        
        // Si no hay eventos
        if (totalEvents === 0) {
            noEventsMessage.style.display = 'block';
            this.openModal(this.elements.allEventsModal);
            return;
        }
        
        noEventsMessage.style.display = 'none';
        
        // Renderizar todos los eventos agrupados por fecha
        this.renderAllEventsList(allEvents);
        
        // Mostrar modal
        this.openModal(this.elements.allEventsModal);
    }

    /**
     * Renderiza la lista de todos los eventos agrupados por fecha
     * @param {Object} allEvents 
     */
    renderAllEventsList(allEvents) {
        const container = this.elements.allEventsList;
        const noEventsMsg = this.elements.noEventsMessage;
        
        // Contar total de eventos
        const totalEvents = Object.values(allEvents).reduce((total, events) => total + events.length, 0);

        if (totalEvents === 0) {
            container.innerHTML = '';
            noEventsMsg.style.display = 'block';
            return;
        }

        noEventsMsg.style.display = 'none';
        
        // Ordenar fechas
        const sortedDates = Object.keys(allEvents).sort((a, b) => new Date(a) - new Date(b));

        let html = '';
        sortedDates.forEach(dateKey => {
            const events = allEvents[dateKey];
            if (!events || events.length === 0) return;
            
            const dateFormatted = this.formatDateKey(dateKey);
            
            html += `
                <div class="events-group">
                    <h3 class="events-date-header">
                        <i class="fas fa-calendar-day"></i>
                        ${dateFormatted}
                        <span class="events-count">(${events.length} evento${events.length > 1 ? 's' : ''})</span>
                    </h3>
                    <div class="events-date-list">
                        ${events.map(event => `
                            <div class="event-item" style="border-left-color: ${this.getColorValue(event.color)}">
                                <div class="event-item-header">
                                    <h4 class="event-item-title">${DOMUtils.sanitizeHTML(event.title)}</h4>
                                    <span class="event-item-time">
                                        ${event.time ? DOMUtils.sanitizeHTML(event.time) : 'Todo el día'}
                                    </span>
                                </div>
                                ${event.description ? `
                                    <p class="event-item-description">${DOMUtils.sanitizeHTML(event.description)}</p>
                                ` : ''}
                                <div class="event-item-actions">
                                    <button class="btn btn-small btn-secondary" onclick="window.rajlCalendar.editEventFromAll('${event.id}', '${dateKey}')">
                                        <i class="fas fa-edit"></i> Editar
                                    </button>
                                    <button class="btn btn-small btn-danger" onclick="window.rajlCalendar.deleteEventFromAll('${event.id}', '${dateKey}')">
                                        <i class="fas fa-trash"></i> Eliminar
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    /**
     * Edita un evento desde la vista "Ver Todos"
     * @param {string} eventId 
     * @param {string} dateKey 
     */
    editEventFromAll(eventId, dateKey) {
        const event = this.eventManager.getEvent(dateKey, eventId);
        if (!event) {
            this.notificationManager.error('Evento no encontrado');
            return;
        }

        // Cerrar modal actual
        this.closeAllEventsModal();
        
        // Abrir modal de edición
        this.openEditModal(event, dateKey);
    }

    /**
     * Elimina un evento desde la vista "Ver Todos"
     * @param {string} eventId 
     * @param {string} dateKey 
     */
    deleteEventFromAll(eventId, dateKey) {
        const success = this.eventManager.deleteEvent(dateKey, eventId);
        
        if (success) {
            this.renderCalendar();
            this.viewAllEvents(); // Actualizar la vista
            this.notificationManager.success('Evento eliminado correctamente');
        } else {
            this.notificationManager.error('Error al eliminar el evento');
        }
    }

    /**
     * Abre el modal de edición de evento
     * @param {Object} event 
     * @param {string} dateKey 
     */
    openEditModal(event, dateKey) {
        if (!this.elements.eventModal) return;

        // Llenar formulario con datos del evento
        if (this.elements.eventTitle) this.elements.eventTitle.value = event.title;
        if (this.elements.eventDescription) this.elements.eventDescription.value = event.description || '';
        if (this.elements.eventTime) this.elements.eventTime.value = event.time || '';

        // Seleccionar color
        const colorOptions = document.querySelectorAll('.color-option');
        colorOptions.forEach(option => option.classList.remove('selected'));
        
        const eventColor = document.querySelector(`[data-color="${event.color}"]`);
        if (eventColor) {
            eventColor.classList.add('selected');
        }

        // Guardar datos para edición
        this.elements.eventModal.dataset.dateKey = dateKey;
        this.elements.eventModal.dataset.eventId = event.id;
        this.elements.eventModal.dataset.editMode = 'true';

        // Cambiar título del modal
        const modalTitle = this.elements.eventModal.querySelector('.modal-title');
        if (modalTitle) {
            modalTitle.innerHTML = '<i class="fas fa-edit"></i> Editar Evento';
        }

        // Mostrar modal
        this.openModal(this.elements.eventModal);

        // Enfocar el campo título
        if (this.elements.eventTitle) {
            setTimeout(() => this.elements.eventTitle.focus(), 100);
        }
    }

    /**
     * Edita un evento desde la lista del día
     * @param {string} eventId 
     */
    editEvent(eventId) {
        const dateKey = DateUtils.formatDateKey(this.selectedDate);
        const event = this.eventManager.getEvent(dateKey, eventId);
        
        if (!event) {
            this.notificationManager.error('Evento no encontrado');
            return;
        }

        // Cerrar modal de lista
        this.closeEventListModal();
        
        // Abrir modal de edición
        this.openEditModal(event, dateKey);
    }

    /**
     * Elimina un evento desde la lista del día
     * @param {string} eventId 
     */
    deleteEvent(eventId) {
        const dateKey = DateUtils.formatDateKey(this.selectedDate);
        const success = this.eventManager.deleteEvent(dateKey, eventId);
        
        if (success) {
            this.renderCalendar();
            
            // Actualizar lista de eventos si el modal está abierto
            const events = this.eventManager.getEventsForDate(this.selectedDate);
            if (events.length > 0) {
                this.renderEventsList(events);
            } else {
                this.closeEventListModal();
            }
            
            this.notificationManager.success('Evento eliminado correctamente');
        } else {
            this.notificationManager.error('Error al eliminar el evento');
        }
    }

    /**
     * Elimina todos los eventos con confirmación
     */
    deleteAllEvents() {
        const allEvents = this.eventManager.getAllEvents();
        const totalEvents = Object.values(allEvents).reduce((total, events) => total + events.length, 0);
        
        if (totalEvents === 0) {
            this.notificationManager.info('No hay eventos para eliminar');
            return;
        }

        // Actualizar el texto del modal con el conteo de eventos
        const confirmBody = this.elements.confirmDeleteModal.querySelector('.confirm-body p:first-child');
        confirmBody.innerHTML = `¿Estás seguro de que quieres eliminar <strong>TODOS</strong> los eventos? (${totalEvents} evento${totalEvents > 1 ? 's' : ''})`;
        
        // Mostrar modal de confirmación
        this.openModal(this.elements.confirmDeleteModal);
    }

    /**
     * Confirma y ejecuta la eliminación de todos los eventos
     */
    confirmDeleteAllEvents() {
        const success = this.eventManager.clearAllEvents();
        
        if (success) {
            this.renderCalendar();
            this.notificationManager.success('Todos los eventos han sido eliminados');
        } else {
            this.notificationManager.error('Error al eliminar los eventos');
        }
        
        // Cerrar modal de confirmación
        this.closeModal(this.elements.confirmDeleteModal);
    }

    /**
     * Abre un modal
     * @param {HTMLElement} modal
     */
    openModal(modal) {
        if (!modal) return;
        
        AnimationUtils.fadeIn(modal);
        modal.classList.add('active');
        
        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';
    }

    /**
     * Cierra el modal principal
     */
    closeModal(specificModal = null) {
        const modal = specificModal || this.elements.eventModal;
        if (!modal) return;

        AnimationUtils.fadeOut(modal);
        modal.classList.remove('active');
        
        // Restaurar scroll del body
        document.body.style.overflow = '';

        // Limpiar datos de edición
        if (modal === this.elements.eventModal) {
            modal.removeAttribute('data-event-id');
            modal.removeAttribute('data-edit-mode');
            
            // Restaurar título del modal
            const modalTitle = modal.querySelector('.modal-title');
            if (modalTitle) {
                modalTitle.innerHTML = '<i class="fas fa-calendar-plus"></i> Agregar Evento';
            }
        }
    }

    /**
     * Cierra el modal de lista de eventos
     */
    closeEventListModal() {
        this.closeModal(this.elements.eventListModal);
    }

    /**
     * Cierra el modal de todos los eventos
     */
    closeAllEventsModal() {
        this.closeModal(this.elements.allEventsModal);
    }

    /**
     * Obtiene el valor hexadecimal de un color
     * @param {string} color
     * @returns {string}
     */
    getColorValue(color) {
        return color || '#2563eb';
    }

    /**
     * Formatea una clave de fecha para mostrar
     * @param {string} dateKey
     * @returns {string}
     */
    formatDateKey(dateKey) {
        const date = DateUtils.parseDate(dateKey);
        return DateUtils.formatDisplayDate(date);
    }

    /**
     * Información de debug
     */
    logInitialization() {
        console.log('🗓️ RAJL Calendar inicializado correctamente');
        console.log('📅 Características disponibles:');
        console.log('   • Navegación con flechas del teclado');
        console.log('   • Doble click para agregar eventos');
        console.log('   • Almacenamiento local de eventos');
        console.log('   • Diseño responsive');
        console.log('   • Atajos de teclado (Inicio/Espacio para hoy)');
        
        const stats = this.eventManager.getStatistics();
        console.log('📊 Estadísticas:', stats);
    }
}

// Inicializar el calendario cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.rajlCalendar = new RAJLCalendar();
});