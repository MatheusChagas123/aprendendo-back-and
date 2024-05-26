const sqliteConnection = require('../../sqlite');
const createUsers = require('./createUsers');

async function migrationsRun(){
  const schems = [
    createUsers
  ].join('');
  sqliteConnection()
  .then(db => db.exec(schems))
  .catch(error => console.error(error));
}
module.exports = migrationsRun;