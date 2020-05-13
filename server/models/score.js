const MysqlUtils = require("../libs/mysql");


class Score {

    constructor() {
        this.database = new MysqlUtils();
    }

      async topThreeScore(){
         let someRows = 2;
         someRows =  await this.database.query( 'SELECT * FROM score' );
         return someRows;

     }

    async addScore(duration){

        const sql = 'insert into score(dateGame, duration) VALUES(now() , ? ) ';
        await this.database.insert( sql, duration );

    }
}


module.exports = Score;