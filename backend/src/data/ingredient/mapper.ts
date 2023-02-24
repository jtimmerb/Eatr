import {Ingredient, IngredientEntity} from './entity';
import {Mapper} from '..';

export const IngredientMapper: Mapper<Ingredient, IngredientEntity> = class {
  public static toDB(t: Ingredient): IngredientEntity {
    return {
      ingredientId: t.ingredientId,
      name: t.name,
      servingSize: t.servingSize,
      calories: t.calories,
      proteins: t.proteins,
      carbohydrates: t.carbohydrates,
      fats: t.fats,
    };
  }

  public static fromDB(d: IngredientEntity): Ingredient {
    return {
      ingredientId: d.ingredientId,
      name: d.name,
      servingSize: d.servingSize,
      calories: d.calories,
      proteins: d.proteins,
      carbohydrates: d.carbohydrates,
      fats: d.fats,
    };
  }
};
