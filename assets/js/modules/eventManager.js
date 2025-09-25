/* ===================================
   Módulo de Eventos del Calendario
   =================================== */

import { CALENDAR_CONFIG, StorageUtils, ValidationUtils, DOMUtils } from '../utils/utils.js';

export class EventManager {
    constructor() {
        this.events = StorageUtils.load(CALENDAR_CONFIG.STORAGE_KEY, {});
        this.selectedDate = null;
    }

    /**
     * Obtiene todos los eventos de una fecha
     * @param {Date} date 
     * @returns {Array}
     */
    getEventsForDate(date) {
        const dateKey = this.getDateKey(date);
        return this.events[dateKey] || [];
    }

    /**
     * Agrega un evento a una fecha
     * @param {Date} date 
     * @param {Object} event 
     * @returns {boolean}
     */
    addEvent(date, event) {
        if (!this.validateEvent(event)) {
            return false;
        }

        const dateKey = this.getDateKey(date);
        
        if (!this.events[dateKey]) {
            this.events[dateKey] = [];
        }

        const newEvent = {
            id: Date.now() + Math.random(),
            title: event.title.trim(),
            description: event.description ? event.description.trim() : '',
            time: event.time || '',
            color: event.color || 'blue',
            date: date.toISOString(),
            createdAt: new Date().toISOString()
        };

        this.events[dateKey].push(newEvent);
        this.saveEvents();
        
        return true;
    }

    /**
     * Elimina un evento
     * @param {Date} date 
     * @param {string} eventId 
     * @returns {boolean}
     */
    removeEvent(date, eventId) {
        const dateKey = this.getDateKey(date);
        
        if (!this.events[dateKey]) {
            return false;
        }

        const eventIndex = this.events[dateKey].findIndex(event => event.id === eventId);
        
        if (eventIndex === -1) {
            return false;
        }

        this.events[dateKey].splice(eventIndex, 1);
        
        // Si no quedan eventos, eliminar la fecha del objeto
        if (this.events[dateKey].length === 0) {
            delete this.events[dateKey];
        }

        this.saveEvents();
        return true;
    }

    /**
     * Actualiza un evento existente
     * @param {Date} date 
     * @param {string} eventId 
     * @param {Object} updatedEvent 
     * @returns {boolean}
     */
    updateEvent(date, eventId, updatedEvent) {
        if (!this.validateEvent(updatedEvent)) {
            return false;
        }

        const dateKey = this.getDateKey(date);
        
        if (!this.events[dateKey]) {
            return false;
        }

        const eventIndex = this.events[dateKey].findIndex(event => event.id === eventId);
        
        if (eventIndex === -1) {
            return false;
        }

        this.events[dateKey][eventIndex] = {
            ...this.events[dateKey][eventIndex],
            ...updatedEvent,
            updatedAt: new Date().toISOString()
        };

        this.saveEvents();
        return true;
    }

    /**
     * Verifica si una fecha tiene eventos
     * @param {Date} date 
     * @returns {boolean}
     */
    hasEvents(date) {
        const dateKey = this.getDateKey(date);
        return this.events[dateKey] && this.events[dateKey].length > 0;
    }

    /**
     * Obtiene el número de eventos de una fecha
     * @param {Date} date 
     * @returns {number}
     */
    getEventCount(date) {
        const dateKey = this.getDateKey(date);
        return this.events[dateKey] ? this.events[dateKey].length : 0;
    }

    /**
     * Obtiene todos los eventos del mes
     * @param {number} year 
     * @param {number} month 
     * @returns {Object}
     */
    getEventsForMonth(year, month) {
        const monthEvents = {};
        
        Object.entries(this.events).forEach(([dateKey, events]) => {
            const [eventYear, eventMonth] = dateKey.split('-').map(Number);
            
            if (eventYear === year && eventMonth === month) {
                monthEvents[dateKey] = events;
            }
        });

        return monthEvents;
    }

    /**
     * Obtiene un evento por su ID
     * @param {string} eventId 
     * @returns {Object|null}
     */
    getEventById(eventId) {
        for (const dateKey in this.events) {
            const events = this.events[dateKey];
            const event = events.find(e => e.id === eventId);
            if (event) {
                return {
                    ...event,
                    date: this.parseDateKey(dateKey)
                };
            }
        }
        return null;
    }

    /**
     * Parsea una clave de fecha a objeto Date
     * @param {string} dateKey 
     * @returns {Date}
     */
    parseDateKey(dateKey) {
        const [year, month, day] = dateKey.split('-').map(Number);
        return new Date(year, month, day);
    }

    /**
     * Busca eventos por título
     * @param {string} query 
     * @returns {Array}
     */
    searchEvents(query) {
        const results = [];
        const searchTerm = query.toLowerCase().trim();

        Object.entries(this.events).forEach(([dateKey, events]) => {
            events.forEach(event => {
                if (event.title.toLowerCase().includes(searchTerm) ||
                    (event.description && event.description.toLowerCase().includes(searchTerm))) {
                    results.push({
                        ...event,
                        dateKey,
                        date: new Date(event.date)
                    });
                }
            });
        });

        return results.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    /**
     * Exporta eventos en formato JSON
     * @returns {string}
     */
    exportEvents() {
        return JSON.stringify(this.events, null, 2);
    }

    /**
     * Importa eventos desde JSON
     * @param {string} jsonData 
     * @returns {boolean}
     */
    importEvents(jsonData) {
        try {
            const importedEvents = JSON.parse(jsonData);
            
            // Validar estructura
            if (typeof importedEvents !== 'object') {
                throw new Error('Formato inválido');
            }

            this.events = { ...this.events, ...importedEvents };
            this.saveEvents();
            
            return true;
        } catch (error) {
            console.error('Error al importar eventos:', error);
            return false;
        }
    }

    /**
     * Limpia todos los eventos
     */
    clearAllEvents() {
        this.events = {};
        this.saveEvents();
    }

    /**
     * Limpia eventos antiguos (más de 1 año)
     */
    cleanOldEvents() {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        Object.entries(this.events).forEach(([dateKey, events]) => {
            const [year, month, day] = dateKey.split('-').map(Number);
            const eventDate = new Date(year, month, day);

            if (eventDate < oneYearAgo) {
                delete this.events[dateKey];
            }
        });

        this.saveEvents();
    }

    /**
     * Genera clave de fecha
     * @param {Date} date 
     * @returns {string}
     */
    getDateKey(date) {
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    }

    /**
     * Valida un evento
     * @param {Object} event 
     * @returns {boolean}
     */
    validateEvent(event) {
        if (!event || typeof event !== 'object') {
            return false;
        }

        if (!ValidationUtils.isNotEmpty(event.title)) {
            return false;
        }

        if (!ValidationUtils.maxLength(event.title, CALENDAR_CONFIG.MAX_EVENT_TITLE_LENGTH)) {
            return false;
        }

        return true;
    }

    /**
     * Guarda eventos en el almacenamiento
     */
    saveEvents() {
        StorageUtils.save(CALENDAR_CONFIG.STORAGE_KEY, this.events);
    }

    /**
     * Recarga eventos del almacenamiento
     */
    reloadEvents() {
        this.events = StorageUtils.load(CALENDAR_CONFIG.STORAGE_KEY, {});
    }

    /**
     * Obtiene estadísticas de eventos
     * @returns {Object}
     */
    getStatistics() {
        let totalEvents = 0;
        let totalDays = 0;
        const colorCount = {};

        Object.values(this.events).forEach(dayEvents => {
            totalDays++;
            totalEvents += dayEvents.length;
            
            dayEvents.forEach(event => {
                colorCount[event.color] = (colorCount[event.color] || 0) + 1;
            });
        });

        return {
            totalEvents,
            totalDays,
            averageEventsPerDay: totalDays > 0 ? (totalEvents / totalDays).toFixed(2) : 0,
            colorDistribution: colorCount,
            mostUsedColor: Object.keys(colorCount).reduce((a, b) => colorCount[a] > colorCount[b] ? a : b, 'blue')
        };
    }

    /**
     * Obtiene todos los eventos
     * @returns {Object}
     */
    getAllEvents() {
        return { ...this.events };
    }

    /**
     * Elimina todos los eventos
     * @returns {boolean}
     */
    clearAllEvents() {
        try {
            this.events = {};
            this.saveEvents();
            return true;
        } catch (error) {
            console.error('Error al eliminar todos los eventos:', error);
            return false;
        }
    }
}