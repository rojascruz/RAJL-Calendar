/* ===================================
   Color Picker - Funcionalidad del Selector de Color
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
    initializeColorPicker();
});

/**
 * Inicializa el selector de color
 */
function initializeColorPicker() {
    const colorOptions = document.querySelectorAll('.color-option');
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remover selección anterior
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Agregar selección a la opción clickeada
            this.classList.add('selected');
            
            // Efecto visual
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Seleccionar color azul por defecto
    const defaultColor = document.querySelector('.color-option[data-color="#2563eb"]');
    if (defaultColor && !document.querySelector('.color-option.selected')) {
        defaultColor.classList.add('selected');
    }
}

/**
 * Obtiene el color seleccionado
 * @returns {string}
 */
function getSelectedColor() {
    const selected = document.querySelector('.color-option.selected');
    return selected ? selected.dataset.color : '#2563eb';
}

/**
 * Selecciona un color específico
 * @param {string} color 
 */
function selectColor(color) {
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.color === color) {
            option.classList.add('selected');
        }
    });
}

// Exportar funciones para uso global
window.colorPicker = {
    getSelectedColor,
    selectColor,
    initialize: initializeColorPicker
};