/* ===================================
   Utilidades Globales
   =================================== */

// Constantes del calendario
export const CALENDAR_CONFIG = {
    MONTH_NAMES: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    DAY_NAMES: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    STORAGE_KEY: 'calendar-events',
    MAX_EVENT_TITLE_LENGTH: 50,
    ANIMATION_DURATION: 300,
    NOTIFICATION_DURATION: 3000
};

// Utilidades de fecha
export const DateUtils = {
    /**
     * Verifica si dos fechas son el mismo día
     * @param {Date} date1 
     * @param {Date} date2 
     * @returns {boolean}
     */
    isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    },

    /**
     * Formatea una fecha para mostrar
     * @param {Date} date 
     * @returns {string}
     */
    formatDate(date) {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('es-ES', options);
    },

    /**
     * Genera una clave única para una fecha
     * @param {Date} date 
     * @returns {string}
     */
    getDateKey(date) {
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    },

    /**
     * Obtiene el primer día del mes
     * @param {Date} date 
     * @returns {Date}
     */
    getFirstDayOfMonth(date) {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    },

    /**
     * Obtiene el último día del mes
     * @param {Date} date 
     * @returns {Date}
     */
    getLastDayOfMonth(date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    },

    /**
     * Clona una fecha
     * @param {Date} date 
     * @returns {Date}
     */
    cloneDate(date) {
        return new Date(date.getTime());
    }
};

// Utilidades del DOM
export const DOMUtils = {
    /**
     * Selecciona un elemento del DOM
     * @param {string} selector 
     * @returns {Element|null}
     */
    $(selector) {
        return document.querySelector(selector);
    },

    /**
     * Selecciona múltiples elementos del DOM
     * @param {string} selector 
     * @returns {NodeList}
     */
    $$(selector) {
        return document.querySelectorAll(selector);
    },

    /**
     * Crea un elemento con clases y atributos opcionales
     * @param {string} tag 
     * @param {string|string[]} className 
     * @param {Object} attributes 
     * @returns {Element}
     */
    createElement(tag, className = '', attributes = {}) {
        const element = document.createElement(tag);
        
        if (className) {
            if (Array.isArray(className)) {
                element.classList.add(...className);
            } else {
                element.className = className;
            }
        }
        
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
        
        return element;
    },

    /**
     * Remueve clase de todos los elementos que la tienen
     * @param {string} className 
     */
    removeClassFromAll(className) {
        this.$$('.' + className).forEach(el => {
            el.classList.remove(className);
        });
    }
};

// Utilidades de almacenamiento
export const StorageUtils = {
    /**
     * Guarda datos en localStorage
     * @param {string} key 
     * @param {any} data 
     */
    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
        }
    },

    /**
     * Carga datos de localStorage
     * @param {string} key 
     * @param {any} defaultValue 
     * @returns {any}
     */
    load(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Error al cargar de localStorage:', error);
            return defaultValue;
        }
    },

    /**
     * Elimina datos de localStorage
     * @param {string} key 
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error al eliminar de localStorage:', error);
        }
    }
};

// Utilidades de animación
export const AnimationUtils = {
    /**
     * Anima la transición del calendario
     * @param {Element} element 
     */
    animateTransition(element) {
        element.style.opacity = '0.7';
        element.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        }, 150);
    },

    /**
     * Anima un elemento con efecto bounce
     * @param {Element} element 
     */
    bounce(element) {
        element.style.transform = 'scale(1.1)';
        setTimeout(() => {
            element.style.transform = '';
        }, 200);
    },

    /**
     * Fade in de un elemento
     * @param {Element} element 
     * @param {number} duration 
     */
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let opacity = 0;
        const timer = setInterval(() => {
            if (opacity >= 1) {
                clearInterval(timer);
            }
            element.style.opacity = opacity;
            opacity += 0.1;
        }, duration / 10);
    },

    /**
     * Fade out de un elemento
     * @param {Element} element 
     * @param {number} duration 
     */
    fadeOut(element, duration = 300) {
        let opacity = 1;
        const timer = setInterval(() => {
            if (opacity <= 0) {
                clearInterval(timer);
                element.style.display = 'none';
            }
            element.style.opacity = opacity;
            opacity -= 0.1;
        }, duration / 10);
    }
};

// Utilidades de validación
export const ValidationUtils = {
    /**
     * Valida si un string no está vacío
     * @param {string} str 
     * @returns {boolean}
     */
    isNotEmpty(str) {
        return str && str.trim().length > 0;
    },

    /**
     * Valida la longitud máxima de un string
     * @param {string} str 
     * @param {number} maxLength 
     * @returns {boolean}
     */
    maxLength(str, maxLength) {
        return str.length <= maxLength;
    },

    /**
     * Valida si es una fecha válida
     * @param {Date} date 
     * @returns {boolean}
     */
    isValidDate(date) {
        return date instanceof Date && !isNaN(date);
    }
};

// Utilidades para dispositivos
export const DeviceUtils = {
    /**
     * Detecta si es un dispositivo móvil
     * @returns {boolean}
     */
    isMobile() {
        return window.innerWidth <= 768;
    },

    /**
     * Detecta si es táctil
     * @returns {boolean}
     */
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },

    /**
     * Obtiene el tipo de dispositivo
     * @returns {string}
     */
    getDeviceType() {
        const width = window.innerWidth;
        if (width <= 480) return 'mobile';
        if (width <= 768) return 'tablet';
        return 'desktop';
    }
};

// Utilidades de eventos
export const EventUtils = {
    /**
     * Previene el comportamiento por defecto y la propagación
     * @param {Event} event 
     */
    prevent(event) {
        event.preventDefault();
        event.stopPropagation();
    },

    /**
     * Throttle para limitar ejecución de funciones
     * @param {Function} func 
     * @param {number} limit 
     * @returns {Function}
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Debounce para retrasar ejecución de funciones
     * @param {Function} func 
     * @param {number} delay 
     * @returns {Function}
     */
    debounce(func, delay) {
        let timeoutId;
        return function() {
            const args = arguments;
            const context = this;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(context, args), delay);
        };
    }
};