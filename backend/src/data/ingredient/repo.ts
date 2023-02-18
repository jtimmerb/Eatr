import {Ingredient, IngredientEntity} from './entity';
import {IngredientMapper} from './mapper';
import {Repo} from '..';

interface IngredientRepoInterface extends Repo<Ingredient> {}

export default class IngredientRepo implements IngredientRepoInterface {
  private postgreDB: any;

  constructor(postgreDB: any) {
    this.postgreDB = postgreDB;
  }
}
