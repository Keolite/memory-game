const MysqlUtils = require("../libs/mysql");


class Score {

    constructor() {
        this.database = new MysqlUtils();
    }

      async topThreeScore(){
         let someRows = 2;
         someRows =  await this.database.query( 'SELECT dateGame, duration FROM score order by duration asc limit 3' );
         return someRows;

     }

    async addScore(duration){

        const sql = 'insert into score(dateGame, duration) VALUES(now() , ? ) ';
        await this.database.insert( sql, duration );

    }
}


module.exports = Score;