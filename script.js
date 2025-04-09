mapboxgl.accessToken = 'pk.eyJ1IjoiamFpbWVuZHJldyIsImEiOiJjbTk0ZXM2YXkwdHV3MmpxdGJzcW4xYTlmIn0.ifMABnlIksh4AjS7j-jCSw';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/jaimendrew/cm975wp33001v01sae2an0jv6',
  center: [-3.7038, 40.4168],
  zoom: 5
});

map.on('load', () => {
  map.addSource('destinos', {
    type: 'geojson',
    data: 'https://raw.githubusercontent.com/MrPofta/honor-the-traveler-data/main/destinos_espana_10.geojson'
  });

  map.addLayer({
    id: 'destinos-layer',
    type: 'symbol',
    source: 'destinos',
    layout: {
      'icon-image': 'marker-15',
      'icon-size': 1.2,
      'icon-allow-overlap': true
    }
  });

  map.on('click', 'destinos-layer', (e) => {
    const props = e.features[0].properties;
    const html = `
      <div style="font-family: sans-serif; font-size: 14px; line-height: 1.4;">
        <strong>${props.name}</strong><br/>
        <em>${props.why_going}</em><br/>
        <p>${props.descripcion_corta}</p>
        <p>${props.descripcion_larga}</p>
      </div>`;
    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(html)
      .addTo(map);
  });

  map.on('mouseenter', 'destinos-layer', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', 'destinos-layer', () => {
    map.getCanvas().style.cursor = '';
  });

  // 🧪 Marcador fijo en Madrid para test
  new mapboxgl.Marker()
    .setLngLat([-3.7038, 40.4168])
    .addTo(map);
});
