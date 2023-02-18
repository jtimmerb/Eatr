import {RecipeIngredient, RecipeIngredientEntity} from './entity';
import {Mapper} from '..';

export const RecipeIngredientMapper: Mapper<RecipeIngredient, RecipeIngredientEntity> = class {
  public static toDB(t: RecipeIngredient): RecipeIngredientEntity {
    return {};
  }

  public static fromDB(d: RecipeIngredientEntity): RecipeIngredient {
    return {};
  }
};
