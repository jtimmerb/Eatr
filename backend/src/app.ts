import express from 'express';
import db_conn from './data/db_conn';
import EatrService from './service/service';
import bodyparser from 'body-parser';
import {Postgres} from './utility/config/config';
// import {dbAuth, dbAuthDock} from './db.config';
// import userCmnds from './data/users/user_db';
// import recipeCmnds from './data/recipes/recipe_db';
// import recipeIngredientCmnds from './data/recipe-ingredient/recipe_ingredient_db';

const app = express();
const database = new db_conn(Postgres.host, Postgres.user, Postgres.password, Postgres.database, Postgres.port);
// const database = new db_conn(
//   dbAuthDock.host,
//   dbAuthDock.user,
//   dbAuthDock.password,
//   dbAuthDock.database,
//   dbAuthDock.port,
// );
const service = new EatrService(app, database);
// const userBack = new userCmnds();
// const recipeBack = new recipeCmnds();
// const recipeIngredientBack = new recipeIngredientCmnds();

service.listen(8080);

app.use(bodyparser.json());

// app.post('/create_recipe', async (req, res) => {
//   recipeBack.create(
//     {
//       recipeId: 0,
//       name: 'Tonys Famous Cookies',
//       steps: ['add butter', 'add sugar', 'add baking powder', 'and tonys secret ingredient'],
//     },
//     service,
//   );
// });

// app.get('/test', (req, res) => {
//   res.send('HELLO');
// });

// app.post('/create_user', async (req, res) => {
//   res.send(await userBack.create({name: req.body.name, userId: 0}, service));
// });

// app.put('/users', async (req, res) => {
//   res.send(await userBack.update({name: req.body.name, userId: req.body.user_id}, service));
// });

// app.get('/users', async (req, res) => {
//   res.send(await userBack.get({name: '', userId: req.body.user_id}, service));
// });

// app.delete('/users/:user_id', async (req, res) => {
//   userBack.delete({userId: parseInt(req.params.user_id), name: ''}, service);
//   res.send('Deleted User\n');
// });

// app.get('/users_e', async (req, res) => {
//   res.send(await userBack.exists({name: req.body.name, userId: 0}, service));
// });

// service.userRepo.getUsersTable();
// service.recipeRepo.getRecipesTable();
// recipeIngredientBack.getTable(service);
// recipeIngredientBack.getRecipesById(
//   {
//     ingredientId: 456,
//     name: 'test',
//     servingSize: 'test',
//     calories: 0,
//     proteins: 0,
//     carbohydrates: 0,
//     fats: 0,
//   },
//   service,
// );
