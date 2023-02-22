import express from 'express';
import db_conn from './data/db_conn';
import EatrService from './service/service';
import bodyparser from 'body-parser';
import {dbAuth} from './db.config';
import userCmnds from './data/users/user_db';
import recipeCmnds from './data/recipes/recipe_db';

const app = express();
const database = new db_conn(dbAuth.dbHost, dbAuth.dbUser, dbAuth.dbPwd, dbAuth.dbName, dbAuth.dbPort);
const service = new EatrService(app, database);
const userBack = new userCmnds();
const recipeBack = new recipeCmnds();

service.listen(8080);

app.use(bodyparser.json());

app.post('/create_recipe', async (req, res) => {
  recipeBack.create(
    {
      recipeID: 0,
      name: 'Tonys Famous Cookies',
      steps: ['add butter', 'add sugar', 'add baking powder', 'and tonys secret ingredient'],
    },
    service,
  );
});

app.get('/test', (req, res) => {
  res.send('HELLO');
});

app.post('/create_user', async (req, res) => {
  res.send(await userBack.create({name: req.body.name, userID: 0}, service));
});

app.put('/users', async (req, res) => {
  res.send(await userBack.update({name: req.body.name, userID: req.body.user_id}, service));
});

app.get('/users', async (req, res) => {
  res.send(await userBack.get({name: '', userID: req.body.user_id}, service));
});

app.delete('/users/:user_id', async (req, res) => {
  userBack.delete({userID: parseInt(req.params.user_id), name: ''}, service);
  res.send('Deleted User\n');
});

app.get('/users_e', async (req, res) => {
  res.send(await userBack.exists({name: req.body.name, userID: 0}, service));
});

//service.userRepo.getUsersTable();
//service.recipeRepo.getRecipesTable();
recipeBack.get({recipeID: 2, name: '', steps: []}, service).then(recipeRet => {
  console.log(recipeRet);
});
