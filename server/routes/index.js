/* Routes */
const DefaultController  =  require('../controllers/defaultController');



module.exports  = (app) => {
    app.get('/', (req, res) => {
        new DefaultController(req, res).index()
    });

    app.get('/score', (req, res) => {
        res.send(`les trois meilleurs`);
    });

    app.get('/score/add/:duration', (req, res) => {
        res.send(`${req.params.duration}`);
    });
}
