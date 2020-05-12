const express = require('express');
const morgan = require('morgan');
const PORT = 3000;

const app = express();
app.use(morgan('dev'))




/* Routes */
app.get('/', (req, res) => {
    res.send('Hello');
});

app.get('/score', (req, res) => {
    res.send(`les trois meilleurs`);
});

app.get('/score/add/:duration', (req, res) => {
    res.send(`${req.params.duration}`);
});



app.listen( PORT, () => {
    console.log(`Listen on ${PORT}`);
})