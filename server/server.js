require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//
// ─── HABILITAR CARPETA PUBLIC ───────────────────────────────────────────────────
//

app.use(express.static(path.resolve(__dirname, '../public')));

//
// ─── RUTAS ──────────────────────────────────────────────────────────────────────
//
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
}, (err, res) => {

    if(err) throw err;

    console.log('Base de datos online');

});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto:', process.env.PORT);
});