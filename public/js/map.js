mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // default style
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 12 // starting zoom
});

const marker = new mapboxgl.Marker({color: "red"})
    .setLngLat(listing.geometry.coordinates) //listing.
    .setPopup(new mapboxgl.Popup({offset: 25})
    .setHTML(`<h3>${listing.title}</h3><p>Exact location will be provided after booking</p>`)
) // add popups
    .addTo(map);

    
const styleSelector = document.getElementById('style-selector');
styleSelector.style.display = 'flex';
styleSelector.style.gap = '10px';
styleSelector.style.backgroundColor = '#fff';
styleSelector.style.padding = '10px';
styleSelector.style.borderRadius = '5px';

// Define the available map styles
const styles = [
    { title: 'Streets', url: 'mapbox://styles/mapbox/streets-v11' },
    { title: 'Dark', url: 'mapbox://styles/mapbox/dark-v10' },
    { title: 'Satellite', url: 'mapbox://styles/mapbox/satellite-v9' }
];

styles.forEach((style, index) => {
    // Create a div to hold the radio button and label
    const styleDiv = document.createElement('div');
    styleDiv.style.display = 'flex';
    styleDiv.style.alignItems = 'center';
    styleDiv.style.gap = '5px';

    // Create a radio button for each style
    const radioButton = document.createElement('input');
    radioButton.type = 'radio';
    radioButton.id = 'style' + index;
    radioButton.name = 'style';
    radioButton.value = index;

    // Create a label for the radio button
    const label = document.createElement('label');
    label.htmlFor = 'style' + index;
    label.textContent = style.title;

    // Update the map style when the radio button is selected
    radioButton.addEventListener('change', (event) => {
        const style = styles[event.target.value];
        map.setStyle(style.url);
    });

    // Add the radio button and label to the style div
    styleDiv.appendChild(radioButton);
    styleDiv.appendChild(label);

    // Add the style div to the style selector
    styleSelector.appendChild(styleDiv);
});