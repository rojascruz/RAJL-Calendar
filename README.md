# 🗓️ RAJL Calendar - Calendario Moderno

Un calendario web moderno y elegante con funcionalidades avanzadas, diseñado con HTML5, CSS3 y JavaScript vanilla.
 
![Calendar Preview](https://img.shields.io/badge/Status-Completed-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Características Principales

### 🎨 Diseño Moderno
- **Interfaz elegante** con gradientes y efectos de vidrio esmerilado
- **Diseño responsive** optimizado para móviles, tablets y desktop
- **Animaciones suaves** y transiciones fluidas
- **Esquema de colores atractivo** con gradientes dinámicos
- **Tipografía moderna** usando Google Fonts (Poppins)

### 🚀 Funcionalidades
- **Navegación intuitiva** entre meses con botones y atajos de teclado
- **Vista de calendario completo** con indicadores visuales claros
- **Gestión de eventos** con modal para agregar/editar eventos
- **Almacenamiento local** persistente de eventos
- **Indicadores visuales** para días con eventos
- **Botón "Hoy"** para navegación rápida al día actual
- **Doble click** para agregar eventos rápidamente

### ⌨️ Atajos de Teclado
- `←` / `→` - Navegar entre meses
- `Inicio` / `Espacio` - Ir al día actual
- `Escape` - Cerrar modal de eventos

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura semántica moderna
- **CSS3** - Estilos avanzados con Flexbox/Grid, gradientes y animaciones
- **JavaScript ES6+** - Funcionalidad interactiva sin dependencias
- **Font Awesome** - Iconografía profesional
- **Google Fonts** - Tipografía web optimizada

## 📱 Responsive Design

El calendario está completamente optimizado para todos los dispositivos:

- **Desktop** (1024px+): Vista completa con todas las funcionalidades
- **Tablet** (768px - 1023px): Diseño adaptado para pantallas medianas
- **Mobile** (320px - 767px): Interfaz optimizada para touch

## 🎯 Cómo Usar

### Instalación Local
1. Clona o descarga el repositorio
2. Abre `index.html` en tu navegador web
3. ¡Listo! El calendario está funcionando

### Funcionalidades Básicas
- **Navegar**: Usa los botones de flecha o las teclas del teclado
- **Seleccionar día**: Click en cualquier día del mes
- **Agregar evento**: Doble click en un día o selecciona y usa el modal
- **Ver eventos**: Los días con eventos muestran un punto indicador

### Gestión de Eventos
1. Haz doble click en un día o selecciónalo y usa el botón de agregar evento
2. Completa el formulario del modal:
   - **Título**: Nombre del evento (requerido)
   - **Descripción**: Detalles adicionales (opcional)
   - **Hora**: Hora específica (opcional)
   - **Color**: Categoría visual del evento
3. Haz click en "Guardar"

## 🎨 Personalización

### Colores
Los colores principales se pueden modificar en `styles.css`:

```css
/* Gradiente principal */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Color del día actual */
.day.today {
    background: linear-gradient(135deg, #48bb78, #38a169);
}

/* Color de día seleccionado */
.day.selected {
    background: linear-gradient(135deg, #ed8936, #dd6b20);
}
```

### Idioma
Para cambiar el idioma, modifica las variables en `script.js`:

```javascript
const monthNames = [
    'January', 'February', 'March', // ... en inglés
];

const dayNames = ['Sunday', 'Monday', 'Tuesday', // ... en inglés
];
```

## 📂 Estructura del Proyecto

```
RAJL-Calendar/
├── index.html          # Estructura HTML principal
├── styles.css          # Estilos CSS modernos
├── script.js           # Lógica JavaScript
└── README.md          # Documentación del proyecto
```

## 🔧 Características Técnicas

### Performance
- **Sin dependencias externas** (excepto CDN para fonts e iconos)
- **Vanilla JavaScript** para máximo rendimiento
- **Lazy loading optimizado** para eventos
- **Almacenamiento eficiente** usando localStorage

### Compatibilidad
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Navegadores móviles modernos

### Accesibilidad
- **Navegación por teclado** completa
- **Contraste mejorado** para mejor legibilidad
- **Tooltips informativos** para eventos
- **Responsive design** para todos los dispositivos

## 🚀 Mejoras Futuras

- [ ] Integración con Google Calendar
- [ ] Temas oscuro/claro
- [ ] Exportar eventos a ICS
- [ ] Notificaciones push
- [ ] Vista semanal/mensual
- [ ] Integración con APIs externas
- [ ] PWA (Progressive Web App)

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Puedes usarlo, modificarlo y distribuirlo libremente.

## 👨‍💻 Autor

Creado con ❤️ por **RAJL**

---

### 🌟 ¡Dale una estrella si te gustó el proyecto!

**RAJL Calendar** - Donde la organización encuentra el diseño perfecto.
