import {Ingredient, IngredientEntity} from './entity';
import {Mapper} from '..';

export const IngredientMapper: Mapper<Ingredient, IngredientEntity> = class {
  public static toDB(t: Ingredient): IngredientEntity {
    return {
      ingredient_id: t.ingredientId,
      name: t.name,
      serving_size: t.servingSize,
      calories: t.calories,
      proteins: t.proteins,
      carbohydrates: t.carbohydrates,
      fats: t.fats,
    };
  }

  public static fromDB(d: IngredientEntity): Ingredient {
    return {
      ingredientId: d.ingredient_id,
      name: d.name,
      servingSize: d.serving_size,
      calories: d.calories,
      proteins: d.proteins,
      carbohydrates: d.carbohydrates,
      fats: d.fats,
    };
  }
};
