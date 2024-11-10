let map;  // Declare the map globally so we can reinitialize it on year change
let geojsonLayer;  // Layer to hold the country data
let militaryData = {};  // Store processed data for easy access
let geojsonData;  // Store GeoJSON data globally for reuse

function addLegendToMap() {
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
        const div = L.DomUtil.create('div', 'info legend'),
              grades = [0.1, 1, 2, 5, 10, 20],
              labels = [];

        div.innerHTML += '<strong>Percentage of GDP used for Military Expenditure (%)</strong><br>';

        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i]) + '; width: 18px; height: 18px; display: inline-block;"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map);
}

function getColor(percentage) {
    return percentage > 20 ? '#800026' :
           percentage > 10 ? '#BD0026' :
           percentage > 5  ? '#E31A1C' :
           percentage > 2  ? '#FC4E2A' :
           percentage > 1  ? '#FD8D3C' :
           percentage > 0.1 ? '#FFEDA0' :
                             '#ccc';
}

function createMap(geojsonData, year) {
    if (geojsonLayer) {
        map.removeLayer(geojsonLayer);
    }

    geojsonLayer = L.geoJson(geojsonData, {
        style: feature => {
            const country = feature.properties.name;
            const data = militaryData[country] && militaryData[country][year] 
                         ? militaryData[country][year] 
                         : { porcentaje: 0 };

            const percentage = data.porcentaje;

            return {
                fillColor: getColor(percentage),
                weight: 1,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.7
            };
        },
        onEachFeature: (feature, layer) => {
            const country = feature.properties.name;
            const data = militaryData[country] && militaryData[country][year] 
                         ? militaryData[country][year] 
                         : { porcentaje: 0 };

            layer.bindTooltip(`<strong>${country}</strong><br>Percentage of GDP: ${data.porcentaje.toFixed(2)}%`);

            // Handle click event to play sound
            layer.on('click', function() {
                showCountryDetails(country, year);
                playSoundByPercentage(data.porcentaje);
            });
        }
    }).addTo(map);
}

// Function to play sound based on percentage
function playSoundByPercentage(percentage) {
    let sound;
    if (percentage > 20) {
        sound = new Audio('./sounds/level_5.mp3');
    } else if (percentage > 10) {
        sound = new Audio('./sounds/level_5.mp3');
    } else if (percentage > 5) {
        sound = new Audio('./sounds/level_4.mp3');
    } else if (percentage > 2) {
        sound = new Audio('./sounds/level_3.mp3');
    } else if (percentage > 1) {
        sound = new Audio('./sounds/level_2.mp3');
    } else {
        sound = new Audio('./sounds/level_1.mp3');
    }
    sound.play();
}


function loadMilitaryData() {
    fetch('./DataToUse.json')
        .then(response => response.json())
        .then(data => {
            militaryData = processMilitaryData(data);
            if (geojsonData) {
                createMap(geojsonData, 2018);  // Create map with default year
            }
        })
        .catch(error => {
            console.error('Error loading military data:', error);
        });
}

function processMilitaryData(data) {
    const processedData = {};
    data.forEach(entry => {
        const country = entry.Name;
        const year = entry.Year;
        if (!processedData[country]) {
            processedData[country] = {};
        }
        processedData[country][year] = {
            porcentaje: entry.porcentaje
        };
    });
    return processedData;
}

function initializeMap() {
    map = L.map('map', {
        center: [20, 0],  // Centro del mapa
        zoom: 2,         // Nivel de zoom inicial
        zoomControl: false,  // Deshabilitar los botones de zoom
        minZoom: 2,  // Límite mínimo de zoom
        maxZoom: 10  // Límite máximo de zoom
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    }).addTo(map);

    // Define los límites del mapa (en este ejemplo, se usa un rectángulo que abarca el mundo)
    const southWest = L.latLng(-85, -180);  // Coordenadas para la esquina suroeste
    const northEast = L.latLng(85, 180);    // Coordenadas para la esquina noreste
    const bounds = L.latLngBounds(southWest, northEast);

    // Establece los límites máximos del mapa
    map.setMaxBounds(bounds);

    // Ajusta el comportamiento para evitar que el mapa se "salga" de los límites
    map.on('drag', function() {
        map.panInsideBounds(bounds, { animate: true });
    });

    addLegendToMap();
    fetchGeoJsonData();
}

function fetchGeoJsonData() {
    fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
        .then(response => response.json())
        .then(data => {
            geojsonData = data;
            if (militaryData && Object.keys(militaryData).length > 0) {
                createMap(geojsonData, 2018);  // Create map with default year if data is loaded
            }
        })
        .catch(error => {
            console.error('Error loading GeoJSON data:', error);
        });
}

document.getElementById('yearRange').addEventListener('input', function() {
    const year = this.value;
    document.getElementById('yearLabel').innerText = year;
    createMap(geojsonData, year);
});

// Initialize map and data loading
initializeMap();
loadMilitaryData();
