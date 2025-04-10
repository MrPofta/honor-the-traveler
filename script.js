
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
      <div style="font-family: 'Arial', sans-serif; font-size: 14px; background: #fff9ec; padding: 12px; border-radius: 8px; color: #333; box-shadow: 0 2px 6px rgba(0,0,0,0.1); max-width: 280px;">
        <h3 style="margin-top: 0; font-size: 16px;">${props.name}</h3>
        <p style="font-style: italic; color: #555;">${props.why_going}</p>
        <p style="margin: 8px 0;"><strong>${props.descripcion_corta}</strong></p>
        <p style="font-size: 13px; color: #666;">${props.descripcion_larga}</p>
      </div>`;
    new mapboxgl.Popup({ offset: 25 })
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
});
