

class ScoreController {

    constructor( req, res){
        this._req = req;
        this._res = res;

    }

    listBest( ){
        this._res.send('Les meilleurs');
    }


    add( duration ){
        this._res.send(`Ajout fait ${duration}`);
    }
}


module.exports = ScoreController;