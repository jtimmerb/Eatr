import {Recipe, RecipeEntity} from './entity';
import {Mapper} from '..';

/** Mapper method that maps User Entity to User DB entity and vice versa */
export const RecipeMapper: Mapper<Recipe, RecipeEntity> = class {
  /** Mapping from User DB Entity to User Entity  */
  public static fromDB(d: RecipeEntity): Recipe {
    return {
      recipeID: d.recipeID,
      name: d.name,
      steps: JSON.parse(d.steps),
    };
  }

  public static toDB(d: Recipe): RecipeEntity {
    return {
      recipeID: d.recipeID,
      name: d.name,
      steps: JSON.stringify(d.steps),
    };
  }
};
