const express = require('express');
const Twig = require('twig');
const routes =  require('./routes/index');
const PORT = 3000;
const app = express();


// Défini le chemin du dossier template pour le html du jeu
app.set('views', __dirname + '/views');
app.set("twig options", {
     allow_async: true,
     strict_variables: false
});

// Défini le chemin du dossier des images, css et js public
app.use(express.static(__dirname + '/public'));


// Chargement des routes
routes(app);




// 2coute du serveur web node.
app.listen( PORT, () => {
    console.log(`Listen on ${PORT}`);
})