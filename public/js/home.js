const greeting = document.querySelector('.greeting');

window.onload = () => {
    if(!sessionStorage.name){
        location.href = '/login';
    } else{
        greeting.innerHTML = `Hello ${sessionStorage.name}`;
    }
}

const logOut = document.querySelector('.logout');

logOut.onclick = () => {
    sessionStorage.clear();
    location.reload();
}

const map = L.map('map').setView([-8.795889, 115.176137], 13);

const baseMaps = {
    osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}),
satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri'
}),
topo: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenTopoMap'
})
};

baseMaps.osm.addTo(map) 

function changeMap(mapType) {
	map.eachLayer(layer => {
		if (layer instanceof L.TileLayer) {
			map.removeLayer(layer);
		}
	});
	baseMaps[mapType].addTo(map);
}

const marker = L.marker([-8.795889, 115.176137]).addTo(map)
	.bindPopup('<b>Faculty of Engineering Udayana University</b><br />This is my campus').openPopup();

const popup = L.popup();
map.on('click', function (e) {
    popup
    .setLatLng(e.latlng)
    .setContent(`You clicked the map at ${e.latlng.toString()}`)
    .openOn(map);
})