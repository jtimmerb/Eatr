import express from 'express';
import {db_conn} from './db';

const app = express();
const bodyparser = require('body-parser');
const {db_host, db_user, db_pwd, db_name, db_port} = require('./db.config.json');

app.use(bodyparser.json());

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.listen(8080, () => {
  console.log('server running');
});

let database = new db_conn(db_host, db_user, db_pwd, db_name, db_port);
database.initializeCon();
database.getUsersTable();
