/* ===================================
   Módulo de Notificaciones
   =================================== */

import { CALENDAR_CONFIG, DOMUtils } from '../utils/utils.js';

export class NotificationManager {
    constructor() {
        this.container = this.createContainer();
        this.notifications = new Map();
    }

    /**
     * Crea el contenedor de notificaciones
     * @returns {Element}
     */
    createContainer() {
        const container = DOMUtils.createElement('div', 'notification-container');
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1100;
            pointer-events: none;
        `;
        document.body.appendChild(container);
        return container;
    }

    /**
     * Muestra una notificación
     * @param {string} message 
     * @param {string} type 
     * @param {number} duration 
     * @returns {string} - ID de la notificación
     */
    show(message, type = 'info', duration = CALENDAR_CONFIG.NOTIFICATION_DURATION) {
        const id = this.generateId();
        const notification = this.createElement(message, type, id);
        
        this.container.appendChild(notification);
        this.notifications.set(id, notification);

        // Animación de entrada
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Auto-eliminar después del tiempo especificado
        if (duration > 0) {
            setTimeout(() => {
                this.hide(id);
            }, duration);
        }

        return id;
    }

    /**
     * Muestra notificación de éxito
     * @param {string} message 
     * @param {number} duration 
     * @returns {string}
     */
    success(message, duration) {
        return this.show(message, 'success', duration);
    }

    /**
     * Muestra notificación de error
     * @param {string} message 
     * @param {number} duration 
     * @returns {string}
     */
    error(message, duration) {
        return this.show(message, 'error', duration);
    }

    /**
     * Muestra notificación de advertencia
     * @param {string} message 
     * @param {number} duration 
     * @returns {string}
     */
    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }

    /**
     * Muestra notificación de información
     * @param {string} message 
     * @param {number} duration 
     * @returns {string}
     */
    info(message, duration) {
        return this.show(message, 'info', duration);
    }

    /**
     * Oculta una notificación específica
     * @param {string} id 
     */
    hide(id) {
        const notification = this.notifications.get(id);
        
        if (!notification) return;

        notification.classList.add('hide');
        
        // Remover del DOM después de la animación
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            this.notifications.delete(id);
        }, 300);
    }

    /**
     * Oculta todas las notificaciones
     */
    hideAll() {
        this.notifications.forEach((notification, id) => {
            this.hide(id);
        });
    }

    /**
     * Crea el elemento de notificación
     * @param {string} message 
     * @param {string} type 
     * @param {string} id 
     * @returns {Element}
     */
    createElement(message, type, id) {
        const notification = DOMUtils.createElement('div', ['notification', `notification-${type}`]);
        notification.setAttribute('data-notification-id', id);
        
        const icon = this.getIcon(type);
        const closeBtn = DOMUtils.createElement('button', 'notification-close');
        closeBtn.innerHTML = '×';
        closeBtn.onclick = () => this.hide(id);

        notification.innerHTML = `
            <div class="notification-content">
                <i class="notification-icon ${icon}"></i>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        notification.appendChild(closeBtn);
        
        // Estilos inline para la notificación
        this.applyStyles(notification, type);
        
        return notification;
    }

    /**
     * Aplica estilos a la notificación
     * @param {Element} notification 
     * @param {string} type 
     */
    applyStyles(notification, type) {
        const colors = {
            success: { bg: '#48bb78', border: '#38a169' },
            error: { bg: '#e53e3e', border: '#c53030' },
            warning: { bg: '#ed8936', border: '#dd6b20' },
            info: { bg: '#667eea', border: '#5a67d8' }
        };

        const color = colors[type] || colors.info;
        
        notification.style.cssText = `
            background: ${color.bg};
            border: 2px solid ${color.border};
            color: white;
            padding: 12px 16px;
            border-radius: 10px;
            margin-bottom: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            font-size: 0.9rem;
            font-weight: 500;
            max-width: 300px;
            word-wrap: break-word;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.3s ease;
            pointer-events: auto;
            position: relative;
        `;

        // Estilos para elementos internos
        const content = notification.querySelector('.notification-content');
        if (content) {
            content.style.cssText = `
                display: flex;
                align-items: center;
                gap: 10px;
            `;
        }

        const icon = notification.querySelector('.notification-icon');
        if (icon) {
            icon.style.cssText = `
                font-size: 1.1rem;
                flex-shrink: 0;
            `;
        }

        const message = notification.querySelector('.notification-message');
        if (message) {
            message.style.cssText = `
                flex: 1;
                line-height: 1.4;
            `;
        }

        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.style.cssText = `
                position: absolute;
                top: 8px;
                right: 8px;
                background: none;
                border: none;
                color: white;
                font-size: 16px;
                cursor: pointer;
                padding: 2px 6px;
                border-radius: 3px;
                opacity: 0.8;
                transition: opacity 0.2s;
            `;
            
            closeBtn.onmouseover = () => closeBtn.style.opacity = '1';
            closeBtn.onmouseout = () => closeBtn.style.opacity = '0.8';
        }

        // Clase show para animación
        const showStyle = document.createElement('style');
        showStyle.textContent = `
            .notification.show {
                opacity: 1 !important;
                transform: translateX(0) !important;
            }
            .notification.hide {
                opacity: 0 !important;
                transform: translateX(100px) !important;
            }
        `;
        
        if (!document.querySelector('#notification-styles')) {
            showStyle.id = 'notification-styles';
            document.head.appendChild(showStyle);
        }
    }

    /**
     * Obtiene el icono para el tipo de notificación
     * @param {string} type 
     * @returns {string}
     */
    getIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        return icons[type] || icons.info;
    }

    /**
     * Genera un ID único para la notificación
     * @returns {string}
     */
    generateId() {
        return 'notification-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Actualiza el contenido de una notificación existente
     * @param {string} id 
     * @param {string} message 
     * @param {string} type 
     */
    update(id, message, type) {
        const notification = this.notifications.get(id);
        
        if (!notification) return;

        const messageElement = notification.querySelector('.notification-message');
        const iconElement = notification.querySelector('.notification-icon');
        
        if (messageElement) {
            messageElement.textContent = message;
        }
        
        if (iconElement && type) {
            iconElement.className = `notification-icon ${this.getIcon(type)}`;
            this.applyStyles(notification, type);
        }
    }

    /**
     * Obtiene el número de notificaciones activas
     * @returns {number}
     */
    getActiveCount() {
        return this.notifications.size;
    }

    /**
     * Limpia todas las notificaciones y el contenedor
     */
    destroy() {
        this.hideAll();
        
        setTimeout(() => {
            if (this.container.parentNode) {
                this.container.parentNode.removeChild(this.container);
            }
        }, 500);
    }
}