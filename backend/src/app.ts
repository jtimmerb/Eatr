import express from 'express';
import db_conn from './service/db_conn';
import EatrService from './service/service';

const app = express();
const bodyparser = require('body-parser');
const {db_host, db_user, db_pwd, db_name, db_port} = require('./db.config.json');
let database = new db_conn(db_host, db_user, db_pwd, db_name, db_port);
let service = new EatrService(app, database);

app.use(bodyparser.json());

app.get('/', (req, res) => {
  res.send('Hello world');
});

service.listen(8080);

app.post('/users', async (req, res) => {
  database.createUser(req.body.user_id, req.body.name);
  res.send('Inserted');
});

app.get('/users/:user_id', async (req, res) => {
  database.getUser(req.params.user_id);
  res.send('Success\n');
});

//database.getUsersTable();

//sqlize
