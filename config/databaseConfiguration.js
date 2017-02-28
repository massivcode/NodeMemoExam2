/**
 * Created by prChoe on 2016-08-16.
 */
var mysql = require('mysql');

var pool = mysql.createPool({
    host: '52.78.131.134',
    port: 3306,
    user: 'root',
    password: 'Dhwldmlakqjqtk',
    database: 'memo_exam',
    connectionLimit: 10,
    waitForConnections: true,
    supportBigNumbers: true,
    bigNumberStrings: true
});

exports.pool = pool;