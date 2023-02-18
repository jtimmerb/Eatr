import {Recipe, RecipeEntity} from './entity';
import {Mapper} from '..';

export const RecipeMapper: Mapper<Recipe, RecipeEntity> = class {
  public static toDB(t: Recipe): RecipeEntity {
    return {};
  }

  public static fromDB(d: RecipeEntity): Recipe {
    return {};
  }
};
