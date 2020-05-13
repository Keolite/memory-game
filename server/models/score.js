const MysqlUtils = require("../libs/mysql");


class Score {

      async topThreeScore(){
         let someRows = 2;
         const database = new MysqlUtils();

         someRows =  await database.query( 'SELECT * FROM score' );
         return someRows;

     }
}


module.exports = Score;