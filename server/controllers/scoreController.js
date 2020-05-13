const Controller = require('../libs/controller');
const Score = require('../models/score');

class ScoreController extends Controller {

    super( req, res){
        this._req = req;
        this._res = res;
    }

    async  add( duration ){

        const scores = new Score();
        this.view.scores = await scores.addScore(duration);
        return this._res.json({ username: duration });
    }
}


module.exports = ScoreController;