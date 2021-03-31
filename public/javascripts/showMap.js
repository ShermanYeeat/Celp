mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
    center: vc.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
})

map.addControl(new mapboxgl.NavigationControl())
new mapboxgl.Marker()
    .setLngLat(vc.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h7>${vc.name}</h7>
                <p> <span class="text-muted"> ${vc.location} </span> </p>`
            )
    )
    .addTo(map)

