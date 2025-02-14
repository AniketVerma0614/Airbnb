mapboxgl.accessToken = mapToken;

const defaultCoordinates = [77.2088, 28.6139];
const coordinates = (listing && listing.geometry && Array.isArray(listing.geometry.coordinates) && listing.geometry.coordinates.length === 2)
  ? listing.geometry.coordinates
  : defaultCoordinates;

const map = new mapboxgl.Map({
  container: 'map',
  center: coordinates,
  zoom: 9,
});

console.log("Map center coordinates:", coordinates);

new mapboxgl.Marker({ color: 'red' })
  .setLngLat(coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25, className: 'my-class' })
      .setHTML(`<h4>${listing.location}</h4><p>Exact Location provided after booking</p>`)
  )
  .addTo(map);


