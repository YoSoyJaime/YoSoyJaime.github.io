import Protobject from './js/protobject.js';
import "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js"
import "https://cdn.jsdelivr.net/npm/d3@7"
import Arduino from './js/arduino.js';
//Ver codigo aqui para entender mas detalles: https://github.com/bellinux/InfoVis2014II/blob/main/presentaciones/codigo-clase11/terremotos.html

//Este codigo abajo agrega todo el HTML y CSS
document.body.insertAdjacentHTML('beforeend', `
    <center><h1>Military Expenditure by Percentage of GDP</h1></center>
    <!-- Slider for Year Selection -->
    <div class="slider-container">
        <label for="yearRange">Year: <span id="yearLabel">2018</span></label>
        <input type="range" min="1960" max="2018" value="2018" id="yearRange">
    </div>

    <div id="map" style="width: 100%; height: 80vh;"></div>
	
    <style>
	


/* Style for the slider */
.slider-container {
    text-align: center;
    margin-bottom: 10px;
}

input[type=range] {
    width: 300px;
}

/* Estilo de la leyenda dentro del mapa */
.legend {
    line-height: 18px;
    color: #555;
    background-color: white;
    padding: 6px 8px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    font-size: 14px;
}


.legend i {
    width: 18px;
    height: 18px;
    display: inline-block;
    margin-right: 8px;
}

.leaflet-image-layer,.leaflet-layer,.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-pane,.leaflet-pane>canvas,.leaflet-pane>svg,.leaflet-tile,.leaflet-tile-container,.leaflet-zoom-box{position:absolute;left:0;top:0}.leaflet-container{overflow:hidden}.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-tile{-webkit-user-select:none;-moz-user-select:none;user-select:none;-webkit-user-drag:none}.leaflet-tile::selection{background:0 0}.leaflet-safari .leaflet-tile{image-rendering:-webkit-optimize-contrast}.leaflet-safari .leaflet-tile-container{width:1600px;height:1600px;-webkit-transform-origin:0 0}.leaflet-marker-icon,.leaflet-marker-shadow{display:block}.leaflet-container .leaflet-overlay-pane svg{max-width:none!important;max-height:none!important}.leaflet-container .leaflet-marker-pane img,.leaflet-container .leaflet-shadow-pane img,.leaflet-container .leaflet-tile,.leaflet-container .leaflet-tile-pane img,.leaflet-container img.leaflet-image-layer{max-width:none!important;max-height:none!important;width:auto;padding:0}.leaflet-container img.leaflet-tile{mix-blend-mode:plus-lighter}.leaflet-container.leaflet-touch-zoom{-ms-touch-action:pan-x pan-y;touch-action:pan-x pan-y}.leaflet-container.leaflet-touch-drag{-ms-touch-action:pinch-zoom;touch-action:none;touch-action:pinch-zoom}.leaflet-container.leaflet-touch-drag.leaflet-touch-zoom{-ms-touch-action:none;touch-action:none}.leaflet-container{-webkit-tap-highlight-color:transparent}.leaflet-container a{-webkit-tap-highlight-color:rgba(51,181,229,.4)}.leaflet-tile{filter:inherit;visibility:hidden}.leaflet-tile-loaded{visibility:inherit}.leaflet-zoom-box{width:0;height:0;-moz-box-sizing:border-box;box-sizing:border-box;z-index:800}.leaflet-overlay-pane svg{-moz-user-select:none}.leaflet-pane{z-index:400}.leaflet-tile-pane{z-index:200}.leaflet-overlay-pane{z-index:400}.leaflet-shadow-pane{z-index:500}.leaflet-marker-pane{z-index:600}.leaflet-tooltip-pane{z-index:650}.leaflet-popup-pane{z-index:700}.leaflet-map-pane canvas{z-index:100}.leaflet-map-pane svg{z-index:200}.leaflet-vml-shape{width:1px;height:1px}.lvml{behavior:url(#default#VML);display:inline-block;position:absolute}.leaflet-control{position:relative;z-index:800;pointer-events:visiblePainted;pointer-events:auto}.leaflet-bottom,.leaflet-top{position:absolute;z-index:1000;pointer-events:none}.leaflet-top{top:0}.leaflet-right{right:0}.leaflet-bottom{bottom:0}.leaflet-left{left:0}.leaflet-control{float:left;clear:both}.leaflet-right .leaflet-control{float:right}.leaflet-top .leaflet-control{margin-top:10px}.leaflet-bottom .leaflet-control{margin-bottom:10px}.leaflet-left .leaflet-control{margin-left:10px}.leaflet-right .leaflet-control{margin-right:10px}.leaflet-fade-anim .leaflet-popup{opacity:0;-webkit-transition:opacity .2s linear;-moz-transition:opacity .2s linear;transition:opacity .2s linear}.leaflet-fade-anim .leaflet-map-pane .leaflet-popup{opacity:1}.leaflet-zoom-animated{-webkit-transform-origin:0 0;-ms-transform-origin:0 0;transform-origin:0 0}svg.leaflet-zoom-animated{will-change:transform}.leaflet-zoom-anim .leaflet-zoom-animated{-webkit-transition:-webkit-transform .25s cubic-bezier(0,0,.25,1);-moz-transition:-moz-transform .25s cubic-bezier(0,0,.25,1);transition:transform .25s cubic-bezier(0,0,.25,1)}.leaflet-pan-anim .leaflet-tile,.leaflet-zoom-anim .leaflet-tile{-webkit-transition:none;-moz-transition:none;transition:none}.leaflet-zoom-anim .leaflet-zoom-hide{visibility:hidden}.leaflet-interactive{cursor:pointer}.leaflet-grab{cursor:-webkit-grab;cursor:-moz-grab;cursor:grab}.leaflet-crosshair,.leaflet-crosshair .leaflet-interactive{cursor:crosshair}.leaflet-control,.leaflet-popup-pane{cursor:auto}.leaflet-dragging .leaflet-grab,.leaflet-dragging .leaflet-grab .leaflet-interactive,.leaflet-dragging .leaflet-marker-draggable{cursor:move;cursor:-webkit-grabbing;cursor:-moz-grabbing;cursor:grabbing}.leaflet-image-layer,.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-pane>svg path,.leaflet-tile-container{pointer-events:none}.leaflet-image-layer.leaflet-interactive,.leaflet-marker-icon.leaflet-interactive,.leaflet-pane>svg path.leaflet-interactive,svg.leaflet-image-layer.leaflet-interactive path{pointer-events:visiblePainted;pointer-events:auto}.leaflet-container{background:#ddd;outline-offset:1px}.leaflet-container a{color:#0078a8}.leaflet-zoom-box{border:2px dotted #38f;background:rgba(255,255,255,.5)}.leaflet-container{font-family:"Helvetica Neue",Arial,Helvetica,sans-serif;font-size:12px;font-size:.75rem;line-height:1.5}.leaflet-bar{box-shadow:0 1px 5px rgba(0,0,0,.65);border-radius:4px}.leaflet-bar a{background-color:#fff;border-bottom:1px solid #ccc;width:26px;height:26px;line-height:26px;display:block;text-align:center;text-decoration:none;color:#000}.leaflet-bar a,.leaflet-control-layers-toggle{background-position:50% 50%;background-repeat:no-repeat;display:block}.leaflet-bar a:focus,.leaflet-bar a:hover{background-color:#f4f4f4}.leaflet-bar a:first-child{border-top-left-radius:4px;border-top-right-radius:4px}.leaflet-bar a:last-child{border-bottom-left-radius:4px;border-bottom-right-radius:4px;border-bottom:none}.leaflet-bar a.leaflet-disabled{cursor:default;background-color:#f4f4f4;color:#bbb}.leaflet-touch .leaflet-bar a{width:30px;height:30px;line-height:30px}.leaflet-touch .leaflet-bar a:first-child{border-top-left-radius:2px;border-top-right-radius:2px}.leaflet-touch .leaflet-bar a:last-child{border-bottom-left-radius:2px;border-bottom-right-radius:2px}.leaflet-control-zoom-in,.leaflet-control-zoom-out{font:bold 18px 'Lucida Console',Monaco,monospace;text-indent:1px}.leaflet-touch .leaflet-control-zoom-in,.leaflet-touch .leaflet-control-zoom-out{font-size:22px}.leaflet-control-layers{box-shadow:0 1px 5px rgba(0,0,0,.4);background:#fff;border-radius:5px}.leaflet-control-layers-toggle{background-image:url(images/layers.png);width:36px;height:36px}.leaflet-retina .leaflet-control-layers-toggle{background-image:url(images/layers-2x.png);background-size:26px 26px}.leaflet-touch .leaflet-control-layers-toggle{width:44px;height:44px}.leaflet-control-layers .leaflet-control-layers-list,.leaflet-control-layers-expanded .leaflet-control-layers-toggle{display:none}.leaflet-control-layers-expanded .leaflet-control-layers-list{display:block;position:relative}.leaflet-control-layers-expanded{padding:6px 10px 6px 6px;color:#333;background:#fff}.leaflet-control-layers-scrollbar{overflow-y:scroll;overflow-x:hidden;padding-right:5px}.leaflet-control-layers-selector{margin-top:2px;position:relative;top:1px}.leaflet-control-layers label{display:block;font-size:13px;font-size:1.08333em}.leaflet-control-layers-separator{height:0;border-top:1px solid #ddd;margin:5px -10px 5px -6px}.leaflet-default-icon-path{background-image:url(images/marker-icon.png)}.leaflet-container .leaflet-control-attribution{background:#fff;background:rgba(255,255,255,.8);margin:0}.leaflet-control-attribution,.leaflet-control-scale-line{padding:0 5px;color:#333;line-height:1.4}.leaflet-control-attribution a{text-decoration:none}.leaflet-control-attribution a:focus,.leaflet-control-attribution a:hover{text-decoration:underline}.leaflet-attribution-flag{display:inline!important;vertical-align:baseline!important;width:1em;height:.6669em}.leaflet-left .leaflet-control-scale{margin-left:5px}.leaflet-bottom .leaflet-control-scale{margin-bottom:5px}.leaflet-control-scale-line{border:2px solid #777;border-top:none;line-height:1.1;padding:2px 5px 1px;white-space:nowrap;-moz-box-sizing:border-box;box-sizing:border-box;background:rgba(255,255,255,.8);text-shadow:1px 1px #fff}.leaflet-control-scale-line:not(:first-child){border-top:2px solid #777;border-bottom:none;margin-top:-2px}.leaflet-control-scale-line:not(:first-child):not(:last-child){border-bottom:2px solid #777}.leaflet-touch .leaflet-bar,.leaflet-touch .leaflet-control-attribution,.leaflet-touch .leaflet-control-layers{box-shadow:none}.leaflet-touch .leaflet-bar,.leaflet-touch .leaflet-control-layers{border:2px solid rgba(0,0,0,.2);background-clip:padding-box}.leaflet-popup{position:absolute;text-align:center;margin-bottom:20px}.leaflet-popup-content-wrapper{padding:1px;text-align:left;border-radius:12px}.leaflet-popup-content{margin:13px 24px 13px 20px;line-height:1.3;font-size:13px;font-size:1.08333em;min-height:1px}.leaflet-popup-content p{margin:17px 0;margin:1.3em 0}.leaflet-popup-tip-container{width:40px;height:20px;position:absolute;left:50%;margin-top:-1px;margin-left:-20px;overflow:hidden;pointer-events:none}.leaflet-popup-tip{width:17px;height:17px;padding:1px;margin:-10px auto 0;pointer-events:auto;-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg)}.leaflet-popup-content-wrapper,.leaflet-popup-tip{background:#fff;color:#333;box-shadow:0 3px 14px rgba(0,0,0,.4)}.leaflet-container a.leaflet-popup-close-button{position:absolute;top:0;right:0;border:none;text-align:center;width:24px;height:24px;font:16px/24px Tahoma,Verdana,sans-serif;color:#757575;text-decoration:none;background:0 0}.leaflet-container a.leaflet-popup-close-button:focus,.leaflet-container a.leaflet-popup-close-button:hover{color:#585858}.leaflet-popup-scrolled{overflow:auto}.leaflet-oldie .leaflet-popup-content-wrapper{-ms-zoom:1}.leaflet-oldie .leaflet-popup-tip{width:24px;margin:0 auto}.leaflet-oldie .leaflet-control-layers,.leaflet-oldie .leaflet-control-zoom,.leaflet-oldie .leaflet-popup-content-wrapper,.leaflet-oldie .leaflet-popup-tip{border:1px solid #999}.leaflet-div-icon{background:#fff;border:1px solid #666}.leaflet-tooltip{position:absolute;padding:6px;background-color:#fff;border:1px solid #fff;border-radius:3px;color:#222;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none;box-shadow:0 1px 3px rgba(0,0,0,.4)}.leaflet-tooltip.leaflet-interactive{cursor:pointer;pointer-events:auto}.leaflet-tooltip-bottom:before,.leaflet-tooltip-left:before,.leaflet-tooltip-right:before,.leaflet-tooltip-top:before{position:absolute;pointer-events:none;border:6px solid transparent;background:0 0;content:""}.leaflet-tooltip-bottom{margin-top:6px}.leaflet-tooltip-top{margin-top:-6px}.leaflet-tooltip-bottom:before,.leaflet-tooltip-top:before{left:50%;margin-left:-6px}.leaflet-tooltip-top:before{bottom:0;margin-bottom:-12px;border-top-color:#fff}.leaflet-tooltip-bottom:before{top:0;margin-top:-12px;margin-left:-6px;border-bottom-color:#fff}.leaflet-tooltip-left{margin-left:-6px}.leaflet-tooltip-right{margin-left:6px}.leaflet-tooltip-left:before,.leaflet-tooltip-right:before{top:50%;margin-top:-6px}.leaflet-tooltip-left:before{right:0;margin-right:-12px;border-left-color:#fff}.leaflet-tooltip-right:before{left:0;margin-left:-12px;border-right-color:#fff}@media print{.leaflet-control{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
	</style>
`);

let map;  // Declare the map globally so we can reinitialize it on year change
let geojsonLayer;  // Layer to hold the country data
let geojsonData;  // Store GeoJSON data globally for reuse
let militaryData = {};  // Store processed data for easy access

function addLegendToMap() {
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
        const div = L.DomUtil.create('div', 'info legend'),
              grades = [0, 1, 2, 3, 4, 5],  // Updated grades for intervals
              labels = [];

        div.innerHTML += '<strong>Percentage of GDP used for Military Expenditure (%)</strong><br>';

        // Add "No data" entry
        div.innerHTML +=
            '<i style="background:' + getColor(0) + '; width: 18px; height: 18px; display: inline-block;"></i> No data<br>';

        // Add remaining intervals
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 0.1) + '; width: 18px; height: 18px; display: inline-block;"></i> ' +
                (grades[i] === 0 ? '0 ' : grades[i]) + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map);
}


function getColor(percentage) {
    return percentage > 5 ? '#800026' :         // Mayor a 5%
           percentage > 4 ? '#BD0026' :         // Entre 4 y 5%
           percentage > 3 ? '#E31A1C' :         // Entre 3 y 4%
           percentage > 2 ? '#FC4E2A' :         // Entre 2 y 3%
           percentage > 1 ? '#FD8D3C' :         // Entre 1 y 2%
           percentage > 0 ? '#FFEDA0' :         // Mayor a 0 y menor o igual a 1 (Amarillo)
                             '#ccc';            // Sin información (gris)
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
              	ActivateShoot(data.porcentaje);
            });
        }
    }).addTo(map);
}

let currentSound = null; // Global variable to track the current sound

let timeout;
let timeout2;


function ActivateShoot(percentage) {
  
  let valor = mapVelocityFromPercentage(percentage);
  console.log(valor)
  Protobject.send({ speed: valor }).to('patada.js');
  timeout = setTimeout(alertFunc, 3000);
  timeout2 = setTimeout(AjustPosition, 3000);
  
}

function alertFunc() {
  Protobject.send({ speed: 0 }).to('patada.js');
}


function mapVelocityFromPercentage(value){
 
	if (value > 10) value = 10;
	
	return -((value*1500) / 10);
}

function playSoundByPercentage(percentage) {
    if (currentSound) {
        currentSound.pause();  // Stop the currently playing sound
        currentSound.currentTime = 0;  // Reset the sound to the beginning
    }

    let sound;
    if (percentage > 5) {
        sound = new Audio('./sounds/level_6.mp3');
    } else if (percentage > 4) {
        sound = new Audio('./sounds/level_5.mp3');
    } else if (percentage > 3) {
        sound = new Audio('./sounds/level_4.mp3');
    } else if (percentage > 2) {
        sound = new Audio('./sounds/level_3.mp3');
    } else if (percentage > 1) {
        sound = new Audio('./sounds/level_2.mp3');
    } else if (percentage > 0) {
        sound = new Audio('./sounds/level_1.mp3');
    } else {
        sound = new Audio('./sounds/error.mp3');  // Sin información o 0%
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
        fetch("https://yosoyjaime.github.io/DataToUse.json")
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
