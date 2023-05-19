const mysql = require('mysql')

const connection = mysql.createPool({
    host: 'db4free.net', 
    port: process.env.PORTBD,
    user: process.env.USER, 
    password: process.env.PASSWORD,
    database: process.env.DATABASE, 
    connectionLimit: 100, 
    multipleStatements: true, 
})

exports.connection = connection
