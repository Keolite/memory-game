const Controller = require('../libs/controller');
const Score = require('../models/score');

class ScoreController extends Controller {

    super( req, res){
        this._req = req;
        this._res = res;
    }

    async  add( duration ){

        const scores = new Score();
        await scores.addScore(duration);
    }

    async  list( ){

        const scores = new Score();
        this.view.scores = await scores.topThreeScore();
        return this._res.json(this.view.scores);
    }
}


module.exports = ScoreController;