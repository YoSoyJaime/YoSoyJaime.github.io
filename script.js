let map;  // Declare the map globally so we can reinitialize it on year change
let geojsonLayer;  // Layer to hold the country data
let geojsonData;  // Store GeoJSON data globally for reuse
let militaryData = {};  // Store processed data for easy access

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

function createMap(geojsonData, militaryData, year) {
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
                playSoundByPercentage(data.porcentaje);
            });
        }
    }).addTo(map);
}

let currentSound = null; // Global variable to track the current sound

function playSoundByPercentage(percentage) {
    if (currentSound) {
        currentSound.pause();  // Stop the currently playing sound
        currentSound.currentTime = 0;  // Reset the sound to the beginning
    }

    let sound;
    if (percentage > 20) {
        sound = new Audio('./sounds/level_6.mp3');
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

    currentSound = sound;  // Set the new sound as the current sound
    currentSound.play();   // Play the new sound
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
        center: [20, 0],  // Center of the map
        zoom: 2,         // Initial zoom level
        zoomControl: false,  // Disable zoom buttons
        minZoom: 2,  // Minimum zoom level
        maxZoom: 10  // Maximum zoom level
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    }).addTo(map);

    // Define the map bounds
    const southWest = L.latLng(-85, -180);
    const northEast = L.latLng(85, 180);
    const bounds = L.latLngBounds(southWest, northEast);

    map.setMaxBounds(bounds);
    map.on('drag', function() {
        map.panInsideBounds(bounds, { animate: true });
    });

    addLegendToMap();

    // Fetch both GeoJSON and Military data
    Promise.all([
        fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json'),
        fetch('./DataToUse.json')
    ])
    .then(([geojsonResponse, militaryResponse]) => Promise.all([geojsonResponse.json(), militaryResponse.json()]))
    .then(([geojsonDataResponse, militaryDataResponse]) => {
        console.log("GeoJSON and Military data loaded.");
        geojsonData = geojsonDataResponse;
        militaryData = processMilitaryData(militaryDataResponse);
        createMap(geojsonData, militaryData, 2018); // Create map with default year
    })
    .catch(error => {
        console.error('Error loading data:', error);
    });
}

document.getElementById('yearRange').addEventListener('input', function() {
    const year = this.value;
    document.getElementById('yearLabel').innerText = year;
    createMap(geojsonData, militaryData, year);
});

// Initialize map and data loading
initializeMap();
