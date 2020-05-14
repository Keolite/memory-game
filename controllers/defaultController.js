const Controller = require('../libs/controller');
const Score = require('../models/score');

// Cette classe contient le controle du process pour le début du jeu
 class DefaultController extends Controller {

    super( req, res){
        this._req = req;
        this._res = res;
    }

    /// Chargement du jeu
    async  index( ){
        const scores = new Score();
        this.view.scores = await scores.topThreeScore();
        return this._res.render('defaultTemplate.html.twig', { scores: this.view.scores });
    }
}


module.exports = DefaultController;