const Controller = require('../libs/controller');
const Score = require('../models/score');

 class DefaultController extends Controller {

    super( req, res){
        this._req = req;
        this._res = res;
    }

    async  index( ){
        const scores = new Score();
        this.view.scores = await scores.topThreeScore();
        console.log( this.view.scores);
        return this._res.render('defaultTemplate.html.twig', { scores: this.view.scores });
    }
}


module.exports = DefaultController;