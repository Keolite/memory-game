/* Routes */

module.exports  = (app) => {
    app.get('/', (req, res) => {
        res.send('Hello');
    });

    app.get('/score', (req, res) => {
        res.send(`les trois meilleurs`);
    });

    app.get('/score/add/:duration', (req, res) => {
        res.send(`${req.params.duration}`);
    });
}
