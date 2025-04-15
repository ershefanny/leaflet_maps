const express = require('express'); // untuk create server
const path = require('path'); // untuk mengetahui lokasi html, css
const bodyParser = require('body-parser'); // untuk send & receive data

require('dotenv').config(); //file env
console.log(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_NAME);

const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
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

    if (!name.length || !email.length || !password.length) {
        return res.json('Fill all the fields');
    }

    knex("users")
        .where({ email: email })
        .first()
        .then(existingUser => {
            if (existingUser) {
                return res.json('Email already exists');
            }

            return knex("users")
                .insert({ name: name, email: email, password: password });
        })
        .then(() => {
            return knex.raw('SELECT LAST_INSERT_ID() AS id');
        })
        .then(() => {
            return res.json({ message: 'User registered successfully' });
        })
        .catch(err => {
            if (!res.headersSent) {
                console.error(err);
                return res.status(500).json('Terjadi kesalahan saat menyimpan user');
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
    console.log('Data diterima:', latitude, longitude, name, description);

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
