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

            layer.on('click', function() {
                showCountryDetails(country, year);
            });
        }
    }).addTo(map);
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
    map = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    }).addTo(map);

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
