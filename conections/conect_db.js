const mysql = require('mysql')

const connection = mysql.createPool({
    host: 'db4free.net', 
    port: 3306,
    user: 'node_tester', 
    password: 'testedenode',
    database: 'cd_node', 
    connectionLimit: 100, 
    multipleStatements: true, 
})

exports.connection = connection