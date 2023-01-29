import express from 'express';

const {db_host, db_user, db_pwd, db_name, db_port} = require('./db.config.json');
var mysql = require('mysql');
const app = express();

var db_connection = mysql.createConnection({
  host: db_host,
  user: db_user,
  password: db_pwd,
  port: db_port,
});

db_connection.connect(function (err: {stack: string}) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database.');
});

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.listen(8080, () => {
  console.log('server running');
});
