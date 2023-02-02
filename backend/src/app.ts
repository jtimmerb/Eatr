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

app.post('/users', async (req, res) => {
  database.createUser(req.body.user_id, req.body.name, res);
});

app.get('/users/:user_id', async (req, res) => {
  database.getUser(req.params.user_id, res);
});

let database = new db_conn(db_host, db_user, db_pwd, db_name, db_port);
database.getUsersTable();
