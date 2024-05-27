
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: [77.5937, 12.9719], // starting position [lng, lat]
    zoom: 9 // starting zoom
});
