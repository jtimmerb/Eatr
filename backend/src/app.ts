import express from 'express';
import {db_conn} from './db';

const {db_host, db_user, db_pwd, db_name, db_port} = require('./db.config.json');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.listen(8080, () => {
  console.log('server running');
});

let db_connection = new db_conn(db_host, db_user, db_pwd, db_name, db_port);
db_connection.initializeCon();
db_connection.getUsersTable();
