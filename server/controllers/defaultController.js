
 class DefaultController {

    constructor( req, res){
        this._req = req;
        this._res = res;

    }

    index( ){
        this._res.render('defaultTemplate.html.twig');
    }
}


module.exports = DefaultController;