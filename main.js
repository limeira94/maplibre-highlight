
const styleDark = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';
// Configurações do mapa principal
const map = new maplibregl.Map({
    container: 'map', // ID do contêiner
    style: styleDark, // Estilo do mapa
    center: [-55.7658, -15.7939], // Coordenadas centrais temporárias [lng, lat]
    zoom: 2, // Zoom inicial temporário
    doubleClickZoom: false, // Desativa o double-click zoom
    dragRotate: false, // Opcional: Desativa a rotação por arrasto
});

// Adiciona controles de navegação (zoom in/out)
map.addControl(new maplibregl.NavigationControl());
// test commit 5
// Carrega o GeoJSON dos países da América do Sul
map.on('load', () => {
    // Adiciona a fonte GeoJSON
    map.addSource('south-america', {
        type: 'geojson',
        data: 'data/south-america.geojson'
    });

    // Adiciona a camada dos países
    map.addLayer({
        id: 'south-america-layer',
        type: 'fill',
        source: 'south-america',
        layout: {},
        paint: {
            'fill-color': 'gray',
            'fill-opacity': 0.7,
            'fill-outline-color': 'white'
        }
    });

    // Adiciona uma camada de destaque (inicialmente vazia)
    map.addLayer({
        id: 'south-america-highlight',
        type: 'fill',
        source: 'south-america',
        layout: {},
        paint: {
            'fill-color': 'red',
            'fill-opacity': 0.4
        },
        filter: ['==', 'name', ''] // Filtro vazio inicialmente
    });

    // Calcula o bounding box da América do Sul usando Turf.js
    fetch('data/south-america.geojson')
        .then(response => response.json())
        .then(data => {
            const bbox = turf.bbox(data); // [minLng, minLat, maxLng, maxLat]
            console.log('Bounding Box da América do Sul:', bbox);

            // Ajusta a visualização do mapa para o bounding box
            map.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], { padding: 50 });
        })
        .catch(error => {
            console.error('Erro ao carregar o GeoJSON:', error);
        });

    // Evento de mousemove para destacar o país sob o cursor
    map.on('mousemove', 'south-america-layer', (e) => {
        if (e.features.length > 0) {
            const feature = e.features[0];
            map.setFilter('south-america-highlight', ['==', 'name', feature.properties.name]);
        }
    });

    // Evento de mouseleave para remover o destaque
    map.on('mouseleave', 'south-america-layer', () => {
        map.setFilter('south-america-highlight', ['==', 'name', '']);
    });

    // Evento de clique para dar zoom no país clicado
    map.on('click', 'south-america-layer', (e) => {
        if (e.features.length > 0) {
            const feature = e.features[0];
            console.log('País clicado no Mapa Principal:', feature.properties.name);

            // Calcula a bounding box usando Turf.js
            const bbox = turf.bbox(feature); // [minLng, minLat, maxLng, maxLat]
            console.log('BBox do País:', bbox);

            // Aplica o zoom no mapa principal
            map.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], { padding: 50, maxZoom: 10 });
        }
    });

    // Muda o cursor para pointer ao passar sobre um país
    map.on('mouseenter', 'south-america-layer', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Restaura o cursor padrão ao sair
    map.on('mouseleave', 'south-america-layer', () => {
        map.getCanvas().style.cursor = '';
    });
});

// // MiniMap Manual
// const miniMap = new maplibregl.Map({
//     container: 'miniMap', // ID do contêiner do MiniMap
//     style: 'https://demotiles.maplibre.org/style.json', // Estilo do MiniMap
//     center: map.getCenter(),
//     zoom: 2, // Nível de zoom do MiniMap
//     interactive: true, // Habilita interações no MiniMap
//     attributionControl: false,
//     doubleClickZoom: false, // Desativa o double-click zoom no MiniMap
//     dragRotate: false, // Opcional: Desativa a rotação por arrasto no MiniMap
// });

// // Sincroniza o MiniMap com o mapa principal
// map.on('move', () => {
//     miniMap.setCenter(map.getCenter());
//     miniMap.setZoom(2); // Mantém um nível de zoom fixo no MiniMap
// });

// // Adiciona a mesma fonte e camada ao MiniMap
// map.on('load', () => {
//     miniMap.on('load', () => {
//         // Adiciona a fonte GeoJSON ao MiniMap
//         miniMap.addSource('south-america-mini', {
//             type: 'geojson',
//             data: 'data/south-america.geojson'
//         });

//         // Adiciona a camada dos países no MiniMap
//         miniMap.addLayer({
//             id: 'south-america-mini-layer',
//             type: 'fill',
//             source: 'south-america-mini',
//             layout: {},
//             paint: {
//                 'fill-color': 'gray',
//                 'fill-opacity': 0.7,
//                 'fill-outline-color': 'white'
//             }
//         });

//         // Adiciona uma camada de destaque no MiniMap
//         miniMap.addLayer({
//             id: 'south-america-mini-highlight',
//             type: 'fill',
//             source: 'south-america-mini',
//             layout: {},
//             paint: {
//                 'fill-color': 'yellow',
//                 'fill-opacity': 0.7
//             },
//             filter: ['==', 'name', ''] // Filtro vazio inicialmente
//         });

//         // Evento de mousemove para destacar o país sob o cursor no MiniMap
//         miniMap.on('mousemove', 'south-america-mini-layer', (e) => {
//             if (e.features.length > 0) {
//                 const feature = e.features[0];
//                 miniMap.setFilter('south-america-mini-highlight', ['==', 'name', feature.properties.name]);
//             }
//         });

//         // Evento de mouseleave para remover o destaque no MiniMap
//         miniMap.on('mouseleave', 'south-america-mini-layer', () => {
//             miniMap.setFilter('south-america-mini-highlight', ['==', 'name', '']);
//         });

//         // Evento de clique no MiniMap para dar zoom no mapa principal
//         miniMap.on('click', 'south-america-mini-layer', (e) => {
//             if (e.features.length > 0) {
//                 const feature = e.features[0];
//                 console.log('País clicado no MiniMap:', feature.properties.name);

//                 // Calcula a bounding box usando Turf.js
//                 const bbox = turf.bbox(feature); // [minLng, minLat, maxLng, maxLat]
//                 console.log('BBox (MiniMap):', bbox);

//                 // Aplica o zoom no mapa principal
//                 map.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], { padding: 50, maxZoom: 10 });
//             }
//         });

//         // Muda o cursor para pointer no MiniMap ao passar sobre um país
//         miniMap.on('mouseenter', 'south-america-mini-layer', () => {
//             miniMap.getCanvas().style.cursor = 'pointer';
//         });

//         // Restaura o cursor padrão ao sair do MiniMap
//         miniMap.on('mouseleave', 'south-america-mini-layer', () => {
//             miniMap.getCanvas().style.cursor = '';
//         });
//     });
// });
