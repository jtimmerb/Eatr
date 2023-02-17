import express from 'express';
import db_conn from './service/db_conn';
import EatrService from './service/service';
import bodyparser from 'body-parser';
import {db_auth} from './db.config';

const app = express();
let database = new db_conn(db_auth.db_host, db_auth.db_user, db_auth.db_pwd, db_auth.db_name, db_auth.db_port);
let service = new EatrService(app, database);

service.listen(8080);

app.use(bodyparser.json());

app.get('/test', (req, res) => {
  res.send("HELLO");
});

app.post('/create_user', async (req, res) => {
  let user = await service.userRepo.create(req.body.name);
  res.send(JSON.stringify(user) + '\n');
  database.getUsersTable();
});

app.put('/users', async (req, res) => {
  let user = await service.userRepo.update(req.body.name, req.body.user_id);
  res.send(JSON.stringify(user) + '\n');
  database.getUsersTable();
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
  service.userRepo.delete(parseInt(req.params.user_id)).catch(err => {
    throw err;
  });
  res.send('Deleted User #' + req.params.user_id + '\n');
  database.getUsersTable();
});

database.getUsersTable();

//sqlize
