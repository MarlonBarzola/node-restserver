const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.json({
        ok: true,
        message: 'Index Page'
    });
});

app.use(require('./usuario'));
app.use(require('./login'));

module.exports = app;