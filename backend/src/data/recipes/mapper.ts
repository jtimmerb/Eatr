import {Recipe, RecipeEntity} from './entity';
import {Mapper} from '..';
import PG from 'pg';

/** Mapper method that maps User Entity to User DB entity and vice versa */
export const RecipeMapper: Mapper<Recipe> = class {
  /** Mapping from User DB Entity to User Entity  */
  public static fromDB(d: PG.QueryResultRow): Recipe {
    return {
      recipeID: d[0].recipe_id,
      name: d[0].name,
      steps: d[0].steps,
    };
  }
};

/*
export const RecipeMapper: Mapper<Recipe, RecipeEntity> = class {
  public static toDB(t: Recipe): RecipeEntity {
    return {};
  }

  public static fromDB(d: RecipeEntity): Recipe {
    return {};
  }*/
