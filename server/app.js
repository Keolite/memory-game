const express = require('express');
const morgan = require('morgan');
const routes = require('./routes/index');

const PORT = 3000;

const app = express();
app.use(morgan('dev'))


routes(app);





app.listen( PORT, () => {
    console.log(`Listen on ${PORT}`);
})