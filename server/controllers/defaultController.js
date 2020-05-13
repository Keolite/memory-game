
class defaultController {

    constructor( req, res){
        this._req = req;
        this._res = res;

    }

    index( ){
        this._res.send('Default page');
    }
}


module.exports = defaultController;