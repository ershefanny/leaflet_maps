const express = require('express'); // untuk create server
const path = require('path'); // untuk mengetahui lokasi html, css
const bodyParser = require('body-parser'); // untuk send & receive data

const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'leaflet_maps'
    }
});

const app = express();

let initialPath = path.join(__dirname, "public");

app.use(bodyParser.json());
app.use(express.static(initialPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(initialPath, "index.html"))
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(initialPath, "login.html"));
})

app.get('/register', (req, res) => {
    res.sendFile(path.join(initialPath, "register.html"))
})

app.post('/register-user', (req, res) => {
    const { name, email, password } = req.body;

    // Validasi input
    if (!name.length || !email.length || !password.length) {
        return res.json('Fill all the fields');  // Menghentikan eksekusi setelah respons
    }

    // Cek apakah email sudah ada
    knex("users")
        .where({ email: email })
        .first()
        .then(existingUser => {
            if (existingUser) {
                return res.json('Email already exists');  // Menghentikan eksekusi setelah respons
            }

            // Jika email tidak ada, lanjutkan dengan penyimpanan user baru
            return knex("users")
                .insert({ name: name, email: email, password: password });
        })
        .then(() => {
            // Ambil ID terakhir yang disisipkan
            return knex.raw('SELECT LAST_INSERT_ID() AS id');
        })
        .then(() => {
            return res.json({ message: 'User registered successfully' });  // Mengirim pesan tanpa ID
        })
        .catch(err => {
            // Pastikan hanya satu respons dikirim
            if (!res.headersSent) {
                console.error(err);
                return res.status(500).json('Terjadi kesalahan saat menyimpan user');  // Menghentikan eksekusi setelah respons
            }
        });
});

app.post('/login-user', (req, res) => {
    const { email, password } = req.body;

    knex.select('name', 'email')
    .from('users')
    .where({
        email: email,
        password: password
    })
    .then(data => {
        if(data.length){
            res.json(data[0]);
        } else{
            res.json('Email or password is incorrect');
        }
    })
})

app.post('/tambah-titik', (req, res) => {
    const { latitude, longitude, name, description } = req.body;

    if (latitude && longitude) {
        knex('titik').insert({
            latitude: latitude,
            longitude: longitude,
            name: name || null,
            description: description || null
        })
        .returning('id')
        .then(result => {
            res.json({ message: 'Titik berhasil disimpan', id: result[0] });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Terjadi kesalahan saat menyimpan titik' });
        });
    } else {
        res.status(400).json({ message: 'Koordinat tidak valid' });
    }
});

app.listen(3000, (req, res) => {
    console.log('listening on port 3000......')
})
