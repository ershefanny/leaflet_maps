const greeting = document.querySelector('.greeting');

window.onload = () => {
    if(!sessionStorage.name){
        location.href = '/login';
    } else{
        greeting.innerHTML = `Hello ${sessionStorage.name}`;

        const userId = sessionStorage.getItem('userId');

        fetch (`/titik-user/${userId}`)
        .then(res => res.json())
        .then(titikList => {
            titikList.forEach(titik => {
                L.marker([titik.latitude, titik.longitude])
                .addTo(map)
                .bindPopup(`<b>${titik.name || 'Tanpa Nama'}</b><br>${titik.description || ''}`);
            });
        })
        .catch(err => {
            console.error('Gagal mengambil titik:', err);
        });
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

baseMaps.osm.addTo(map);

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
    const latitude = e.latlng.lat;
    const longitude = e.latlng.lng;

    const formHtml = `
        <form id="titikForm">
            <label for="name">Nama:</label><br>
            <input type="text" id="name" name="name"><br><br>
            <label for="description">Deskripsi:</label><br>
            <textarea id="description" name="description"></textarea><br><br>
            <button type="submit">Simpan</button>
        </form>
    `;

    popup
        .setLatLng(e.latlng)
        .setContent(formHtml)
        .openOn(map);

    document.getElementById('titikForm').onsubmit = (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const user_id = sessionStorage.getItem("userId");

        fetch('https://gis_2205551102.manpits.xyz/tambah-titik', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ latitude, longitude, name, description, user_id }),
        })
        .then(response => response.json())
        .then(data => {
            alert(`Titik berhasil disimpan dengan ID: ${data.id}`);
            const newMarker = L.marker([latitude, longitude]).addTo(map)
                .bindPopup(`<b>${name || 'Tanpa Nama'}</b><br />${description || 'Tanpa Deskripsi'}`).openPopup();
        })
        .catch(error => {
            console.error('Terjadi kesalahan:', error);
            alert('Terjadi kesalahan saat menyimpan titik.');
        });
    };
});
