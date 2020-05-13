const express = require('express');
const Twig = require('twig');
const routes =  require('./routes/index');
const PORT = 3000;
const app = express();



app.set('views', __dirname + '/views');
app.set("twig options", {
     allow_async: true,
     strict_variables: false
});

routes(app);





app.listen( PORT, () => {
    console.log(`Listen on ${PORT}`);
})