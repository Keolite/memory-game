/* Routes */
const DefaultController  =  require('../controllers/defaultController');
const ScoreController  =  require('../controllers/scoreController');



module.exports  = (app) => {
    app.get('/', (req, res) => {
        new DefaultController(req, res).index()
    });

    app.get('/score/add/:duration', (req, res) => {
        new ScoreController(req, res).add(req.params.duration)
    });

    app.get('/score', (req, res) => {
        new ScoreController(req, res).list()
    });
}
