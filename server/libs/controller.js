

class Controller{

    constructor(req = null, res = null)
    {
        this._req = req;
        this._res = res;
        this.view = new Object();

    }


    getReq()
    {
        return this._req;
    }

    getRes()
    {
        return this._res;
    }



    render(template)
    {
            return this.getRes().render(template, this.view);
    }

}

module.exports = Controller;