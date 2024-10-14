// Datos de los países con mayor porcentaje de gasto militar
const topCountries = [
    {'Name': 'Arabia Saudita', 'CODE': 'SAU', 'porcentaje': 8.589038975798779}, 
    {'Name': 'Kuwait', 'CODE': 'KWT', 'porcentaje': 5.280170635707574}, 
    {'Name': 'Líbano', 'CODE': 'LBN', 'porcentaje': 5.021256792997223}
];

// Obtener el contenedor donde se mostrará la lista
const countryList = document.getElementById('country-list');

// Iterar sobre los países y agregar un elemento de lista (li) por cada uno
topCountries.forEach(country => {
    const listItem = document.createElement('li');
    listItem.innerText = `${country.Name}: ${country.porcentaje.toFixed(2)}%`;
    countryList.appendChild(listItem);
});

// Crear el gráfico Plotly
const myPlot = document.getElementById('map');

const countrie = countries.map(item => item.CODE);
const porcentaje = countries.map(item => item.porcentaje);
const names = countries.map(item => item.Name);

// Crear datos para cada rango
const data = [];

// Definir colores y rangos
const ranges = [
    { min: 0, max: 0.01, color: 'black', label: 'Falta Información' },
    { min: 0.1, max: 1, color: '#FFEDA0', label: '0% - 1%' },
    { min: 1, max: 2, color: '#FD8D3C', label: '1% - 2%' },
    { min: 2, max: 3, color: '#FC4E2A', label: '2% - 3%' },
    { min: 3, max: 4, color: '#E31A1C', label: '3% - 4%' },
    { min: 4, max: 5, color: '#BD0026', label: '4% - 5%' },
    { min: 5, max: Infinity, color: '#800026', label: '5% <' },
];

// Crear una traza para cada rango
ranges.forEach(range => {
    const z = porcentaje.map(p => (p >= range.min && p < range.max) ? 1 : null); // 1 para rango, null para fuera del rango
    
    data.push({
        type: 'choropleth',
        locations: countrie,
        locationmode: 'country codes',
        text: names,
        z: z,
        colorscale: [[0, range.color], [1, range.color]], // Colores fijos
        showscale: false, // No mostrar escala de colores
        name: range.label, // Nombre para la leyenda
        showlegend: true, // Mostrar la leyenda
        hoverinfo: 'none'
    });
});

var layout = {
    title: 'Porcentaje del PIB utilizado en gastos militares en 2018',
    geo: {
        projection: {
            type: 'equirectangular'
        },
        bgcolor: 'lightgray'
    },
    dragmode: false,
    paper_bgcolor: 'white', // Color de fondo del área del gráfico
    plot_bgcolor: 'white', // Color de fondo del área de trazado,

    legend: {
        orientation: 'h', // Orientación horizontal
        x: 0.5, // Centrado horizontalmente
        y: -0.15, // Posición vertical (ajusta según sea necesario)
        xanchor: 'center', // Anclaje horizontal al centro
        yanchor: 'top', // Anclaje vertical al borde superior
        font: {
            size: 24 // Aumentar el tamaño de la fuente de la leyenda
        },
        traceorder: 'normal',// Orden normal de las trazas,
        bordercolor: 'black',
        borderwidth: 2,
        entrywidth: 500,
        itemclick: false,
        itemdoubleclick: false,
        itemwidth: 50,
        clickmode: 'none'
    }
};

Plotly.newPlot(myPlot, data, layout, { scrollZoom: false, displayModeBar: false });
