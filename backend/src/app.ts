import {errorMonitor} from 'events';
import express from 'express';
import {stringify} from 'querystring';
import db_conn from './service/db_conn';
import EatrService from './service/service';

const app = express();
const bodyparser = require('body-parser');
const {db_host, db_user, db_pwd, db_name, db_port} = require('./db.config.json');
let database = new db_conn(db_host, db_user, db_pwd, db_name, db_port);
let service = new EatrService(app, database);

service.listen(8080);

app.use(bodyparser.json());

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.post('/users', async (req, res) => {
  database.createUser(req.body.user_id, req.body.name);
  res.send('Inserted\n');
});

app.post('/create_user', async (req, res) => {
  let user = await service.userRepo.save(req.body.name);
  res.send(JSON.stringify(user) + '\n');
});

app.get('/users/:user_id', async (req, res) => {
  //database.getUser(req.params.user_id);
  let user = await service.userRepo.getUserByID(req.params.user_id).catch(err => {
    throw err;
  });
  res.send(JSON.stringify(user) + '\n');
});

app.delete('/users/:user_id', async (req, res) => {
  //database.getUser(req.params.user_id);
  let user = await service.userRepo.delete(parseInt(req.params.user_id)).catch(err => {
    throw err;
  });
  res.send('Deleted User #' + req.params.user_id + '\n');
  database.getUsersTable();
});

database.getUsersTable();

//sqlize
