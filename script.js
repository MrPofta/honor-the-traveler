// Token de Mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoiamFpbWVuZHJldyIsImEiOiJjbTk0ZXM2YXkwdHV3MmpxdGJzcW4xYTlmIn0.ifMABnlIksh4AjS7j-jCSw';

// Variables globales
let map;
let destinosData = [];
let filteredDestinos = [];
let currentSlide = 0;
const slideWidth = 320; // Ancho de tarjeta + margen

// Inicialización cuando el documento está listo
document.addEventListener('DOMContentLoaded', async () => {
    // Inicializar mapa
    initMap();
    
    // Cargar los datos de destinos
    await loadDestinos();
    
    // Inicializar el carrusel
    setupCarousel();
    
    // Configurar eventos para filtros
    document.getElementById('aplicar-filtros').addEventListener('click', applyFilters);
});

// Inicializar el mapa
function initMap() {
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/jaimendrew/cm975wp33001v01sae2an0jv6', // Puedes cambiar a tu estilo personalizado
        center: [-3.7038, 40.4168], // Centro en España (Madrid)
        zoom: 5
    });
    
    // Controles de navegación
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Esperar a que el mapa se cargue
    map.on('load', function() {
        // Aquí se pueden añadir capas adicionales o configuración
    });
}

// Cargar los datos de destinos desde el archivo JSON de GitHub
async function loadDestinos() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/MrPofta/honor-the-traveler/main/destinos_espana_10.geojson');
        const data = await response.json();
        
        if (data && data.features) {
            destinosData = data.features;
            filteredDestinos = [...destinosData];
            
            // Procesar los destinos
            processDestinos(destinosData);
        }
    } catch (error) {
        console.error('Error al cargar los datos de destinos:', error);
    }
}

// Procesar los destinos cargados
function processDestinos(destinos) {
    // Limpiar marcadores existentes
    document.querySelectorAll('.mapboxgl-marker').forEach(marker => marker.remove());
    
    // Agregar marcadores al mapa
    destinos.forEach(destino => {
        addMarkerToMap(destino);
    });
    
    // Ajustar la vista del mapa para mostrar todos los marcadores
    if (destinos.length > 0) {
        fitMapToMarkers(destinos);
    }
    
    // Renderizar tarjetas de destinos
    renderDestinationCards(destinos);
}

// Añadir un marcador al mapa
function addMarkerToMap(destino) {
    const properties = destino.properties;
    const coordinates = destino.geometry.coordinates;
    
    // Crear elemento para el marcador
    const el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundImage = getMarkerIcon(properties.tipo);
    el.style.width = '30px';
    el.style.height = '30px';
    el.style.backgroundSize = 'cover';
    el.style.cursor = 'pointer';
    
    // Crear popup
    const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
            <h3 class="popup-title">${properties.nombre}</h3>
            <p class="popup-type">${properties.tipo}</p>
            <p class="popup-description">${properties.descripcion.substring(0, 100)}...</p>
            <button class="popup-button" onclick="centerOnDestination(${coordinates[0]}, ${coordinates[1]})">Ver detalles</button>
        `);
    
    // Añadir marcador al mapa
    new mapboxgl.Marker(el)
        .setLngLat(coordinates)
        .setPopup(popup)
        .addTo(map);
}

// Obtener ícono para el marcador según el tipo
function getMarkerIcon(tipo) {
    const tipoLower = tipo.toLowerCase();
    
    if (tipoLower.includes('playa')) {
        return 'url(https://cdn-icons-png.flaticon.com/128/2748/2748525.png)';
    } else if (tipoLower.includes('cultura') || tipoLower.includes('histórico')) {
        return 'url(https://cdn-icons-png.flaticon.com/128/2077/2077491.png)';
    } else if (tipoLower.includes('naturaleza')) {
        return 'url(https://cdn-icons-png.flaticon.com/128/2752/2752831.png)';
    } else if (tipoLower.includes('aventura')) {
        return 'url(https://cdn-icons-png.flaticon.com/128/2089/2089919.png)';
    } else {
        return 'url(https://cdn-icons-png.flaticon.com/128/684/684908.png)';
    }
}

// Ajustar el mapa para mostrar todos los marcadores
function fitMapToMarkers(destinos) {
    const bounds = new mapboxgl.LngLatBounds();
    
    destinos.forEach(destino => {
        bounds.extend(destino.geometry.coordinates);
    });
    
    map.fitBounds(bounds, {
        padding: 50,
        maxZoom: 10
    });
}

// Centrar el mapa en un destino específico
function centerOnDestination(lng, lat) {
    map.flyTo({
        center: [lng, lat],
        zoom: 12,
        essential: true
    });
}

// Renderizar tarjetas de destinos en el carrusel
function renderDestinationCards(destinos) {
    const container = document.getElementById('destinations-container');
    container.innerHTML = '';
    
    destinos.forEach(destino => {
        const properties = destino.properties;
        
        // Crear una tarjeta para cada destino
        const card = document.createElement('div');
        card.className = 'destination-card';
        
        // Imagen placeholder (en un proyecto real usarías imágenes reales)
        const imgUrl = getDestinationImage(properties.tipo);
        
        card.innerHTML = `
            <div class="card-image" style="background-image: url('${imgUrl}')"></div>
            <div class="card-content">
                <h3 class="card-title">${properties.nombre}</h3>
                <p class="card-type">${properties.tipo}</p>
                <p class="card-description">${properties.descripcion.substring(0, 100)}...</p>
                <div class="card-details">
                    <span>${properties.temporada || 'Todo el año'}</span>
                    <span>${properties.presupuesto || 'Varios precios'}</span>
                </div>
            </div>
        `;
        
        // Evento click para centrar el mapa en el destino
        card.addEventListener('click', () => {
            centerOnDestination(destino.geometry.coordinates[0], destino.geometry.coordinates[1]);
        });
        
        container.appendChild(card);
    });
}

// Obtener imagen para la tarjeta según el tipo
function getDestinationImage(tipo) {
    const tipoLower = tipo.toLowerCase();
    
    if (tipoLower.includes('playa')) {
        return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60';
    } else if (tipoLower.includes('cultura') || tipoLower.includes('histórico')) {
        return 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?auto=format&fit=crop&w=800&q=60';
    } else if (tipoLower.includes('naturaleza')) {
        return 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=60';
    } else if (tipoLower.includes('aventura')) {
        return 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=800&q=60';
    } else {
        return 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=800&q=60';
    }
}

// Configurar el carrusel
function setupCarousel() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const container = document.getElementById('destinations-container');
    
    // Botón siguiente
    nextBtn.addEventListener('click', () => {
        if (currentSlide < filteredDestinos.length - 1) {
            currentSlide++;
            container.scrollLeft += slideWidth;
        }
    });
    
    // Botón anterior
    prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
            container.scrollLeft -= slideWidth;
        }
    });
}

// Aplicar filtros
function applyFilters() {
    const tipoDestino = document.getElementById('tipo-destino').value;
    const temporada = document.getElementById('temporada').value;
    const presupuesto = document.getElementById('presupuesto').value;
    
    // Filtrar los destinos
    filteredDestinos = destinosData.filter(destino => {
        const props = destino.properties;
        
        // Filtrar por tipo de destino
        if (tipoDestino !== 'todos' && !props.tipo.toLowerCase().includes(tipoDestino.toLowerCase())) {
            return false;
        }
        
        // Filtrar por temporada (si existe la propiedad)
        if (temporada !== 'todas' && props.temporada && !props.temporada.toLowerCase().includes(temporada.toLowerCase())) {
            return false;
        }
        
        // Filtrar por presupuesto (si existe la propiedad)
        if (presupuesto !== 'todos' && props.presupuesto && !props.presupuesto.toLowerCase().includes(presupuesto.toLowerCase())) {
            return false;
        }
        
        return true;
    });
    
    // Resetear el carrusel
    currentSlide = 0;
    
    // Actualizar la visualización
    processDestinos(filteredDestinos);
}

// Función para crear un GeoJSON simple si no tienes uno (solo para testing)
function createSampleGeoJSON() {
    return {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "nombre": "Barcelona",
                    "tipo": "Cultura e Historia",
                    "descripcion": "Ciudad cosmopolita con impresionante arquitectura modernista, excelente gastronomía y hermosas playas.",
                    "temporada": "Primavera, Otoño",
                    "presupuesto": "Moderado"
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [2.1734, 41.3851]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "nombre": "Sevilla",
                    "tipo": "Cultura",
                    "descripcion": "Capital andaluza conocida por su catedral, la Giralda, su tradición flamenca y su animada vida callejera.",
                    "temporada": "Primavera, Otoño",
                    "presupuesto": "Económico"
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [-5.9845, 37.3891]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "nombre": "Ibiza",
                    "tipo": "Playa y Fiesta",
                    "descripcion": "Isla conocida por sus playas de arena blanca, aguas cristalinas y famosa vida nocturna.",
                    "temporada": "Verano",
                    "presupuesto": "Premium"
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [1.4317, 38.9067]
                }
            }
            // Puedes añadir más destinos si lo necesitas para pruebas
        ]
    };
}
