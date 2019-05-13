let conn = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: 'root',
        database: 'user_detail'
    }
});
module.exports = conn;