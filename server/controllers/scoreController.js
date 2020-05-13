const  ScoreEntity = require('../models/score');

class ScoreController {

    constructor( req, res){
        this._req = req;
        this._res = res;

    }

    async listBest( ){
        //const Score = new ScoreEntity();
        //const view = new Object();
        //view.score = await Score.topThreeScore();
        this._res.render('Les meilleurs');
    }


    add( duration ){
        this._res.send(`Ajout fait ${duration}`);
    }
}


module.exports = ScoreController;