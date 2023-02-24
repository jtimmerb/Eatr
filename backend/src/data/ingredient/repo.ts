import {Ingredient, IngredientEntity} from './entity';
import {IngredientMapper} from './mapper';
import {Repo} from '..';

type IngredientRepoInterface = Repo<Ingredient>;

export default class IngredientRepo implements IngredientRepoInterface {
  private postgreDB: any;

  constructor(postgreDB: any) {
    this.postgreDB = postgreDB;
  }

  public async delete(t: Ingredient): Promise<void> {
    return;
  }

  public async create(t: Ingredient): Promise<Ingredient> {
    return t;
  }

  public async update(t: Ingredient): Promise<Ingredient> {
    return t;
  }

  public async exists(t: Ingredient): Promise<boolean> {
    return true;
  }

  public async get(t: Ingredient): Promise<Ingredient> {
    return t;
  }
}
