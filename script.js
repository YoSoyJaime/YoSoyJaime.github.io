let map;  // Declare the map globally so we can reinitialize it on year change
let geojsonLayer;  // Layer to hold the country data
let militaryData = {};  // Store processed data for easy access
let geojsonData;  // Store GeoJSON data globally for reuse

// Function to create the legend for color coding on the map
function addLegendToMap() {
    const legend = L.control({ position: 'bottomright' });  // Position legend in the bottom-right corner

    legend.onAdd = function (map) {
        const div = L.DomUtil.create('div', 'info legend'),
              grades = [0.1, 1, 2, 5, 10, 20],  // Percentage values for legend categories
              labels = [];

        // Create a header for the legend
        div.innerHTML += '<strong>Percentage of GDP used for Military Expenditure (%)</strong><br>';

        // Loop through intervals and generate a label with a colored square for each range
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i]) + '; width: 18px; height: 18px; display: inline-block;"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map);  // Add the legend to the map
}

function getColor(percentage) {
    // Assign colors based on percentage values
    return percentage > 20 ? '#800026' :
           percentage > 10 ? '#BD0026' :
           percentage > 5  ? '#E31A1C' :
           percentage > 2  ? '#FC4E2A' :
           percentage > 1  ? '#FD8D3C' :
           percentage > 0.1 ? '#FFEDA0' :
                             '#ccc';  // Default color for no data or very low percentage
}

function createMap(geojsonData, year) {
    if (geojsonLayer) {
        map.removeLayer(geojsonLayer);  // Remove the existing layer before adding a new one
    }

    geojsonLayer = L.geoJson(geojsonData, {
        style: feature => {
            const country = feature.properties.name;
            const data = militaryData[country] && militaryData[country][year] 
                         ? militaryData[country][year] 
                         : { porcentaje: 0 };

            const percentage = data.porcentaje;  // Use the calculated percentage value

            return {
                fillColor: getColor(percentage),
                weight: 1,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.7,
                transition: 'fill-opacity 0.5s ease' // Smooth transitions
            };
        },
        onEachFeature: (feature, layer) => {
            const country = feature.properties.name;
            const data = militaryData[country] && militaryData[country][year] 
                         ? militaryData[country][year] 
                         : { porcentaje: 0 };

            layer.bindTooltip(`<strong>${country}</strong><br>Percentage of GDP: ${data.porcentaje.toFixed(2)}%`);

            // Handle click event to show more information
            layer.on('click', function() {
                showCountryDetails(country, year);
            });
        }
    }).addTo(map);
}

function loadMilitaryData() {
    fetch('./DataToUse.json')  // Load the JSON file
        .then(response => response.json())
        .then(data => {
            militaryData = processMilitaryData(data);
            initializeMap();  // Initialize the map once data is loaded
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
    map = L.map('map').setView([20, 0], 2);  // Center the map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    addLegendToMap();  // Add legend after creating the map
    fetchGeoJsonData();  // Load GeoJSON data
}

function fetchGeoJsonData() {
    fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
        .then(response => response.json())
        .then(data => {
            geojsonData = data;
            createMap(geojsonData, 2018);  // Initially display data for 2020
        })
        .catch(error => {
            console.error('Error loading GeoJSON data:', error);
        });
}

// Event listener for year range slider
document.getElementById('yearRange').addEventListener('input', function() {
    const year = this.value;
    document.getElementById('yearLabel').innerText = year;
    createMap(geojsonData, year);  // Update map based on the selected year
});

// Load military data and initialize the map
loadMilitaryData();


// Initialize the map and load data
initializeMap();
loadData();
