import express, {Response} from 'express';
import db_conn from './data/db_conn';
import EatrService from './service/service';
import bodyparser from 'body-parser';
import {db_auth} from './db.config';
import {createUser, updateUser, getUser, deleteUser} from './data/users/user_db';

const app = express();
let database = new db_conn(db_auth.db_host, db_auth.db_user, db_auth.db_pwd, db_auth.db_name, db_auth.db_port);
let service = new EatrService(app, database);

service.listen(8080);

app.use(bodyparser.json());

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.post('/create_user', (req, res) => {
  createUser(req.body.name, res, service);
});

app.put('/users', async (req, res) => {
  updateUser(req.body.name, req.body.user_id, res, service);
});

app.get('/users', async (req, res) => {
  getUser(req.body.user_id, res, service);
});

app.delete('/users', async (req, res) => {
  deleteUser(req.body.user_id, res, service);
});

service.userRepo.getUsersTable();
