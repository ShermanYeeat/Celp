mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
    center: vaccineCenter.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
})

map.addControl(new mapboxgl.NavigationControl())
new mapboxgl.Marker()
    .setLngLat(vaccineCenter.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${vaccineCenter.title}</h3><p>${vaccineCenter.location}</p>`
            )
    )
    .addTo(map)

