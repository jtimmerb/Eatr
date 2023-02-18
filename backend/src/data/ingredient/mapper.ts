import {Ingredient, IngredientEntity} from './entity';
import {Mapper} from '..';

export const IngredientMapper: Mapper<Ingredient, IngredientEntity> = class {
  public static toDB(t: Ingredient): IngredientEntity {
    return {};
  }

  public static fromDB(d: IngredientEntity): Ingredient {
    return {};
  }
};
