import React from "react";
import { Ingredient } from "../../api/pantry";
import { Recipe, IngredientPortion } from "../../api/recipe";

interface IProps {
  ingredients: IngredientPortion[];
  recipe: Recipe
}

const InfoSection: React.FC<IProps> = (props) => {
  const {ingredients, recipe} = props;

  

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-2">
        <h3 className="font-bold text-xl pb-1">Ingredients</h3>
        {ingredients.map((ing) => (
          <p key={ing.name}className="text-sm text-gray-700">{`${ing.amount} ${ing.name}`}</p>
        ))}
      </div>

      <div className="flex flex-col space-y-2">
        <h3 className="font-bold text-xl pb-1">Preparations</h3>
        {recipe.steps.map((step, index) => (
          <div key={step} className="flex flex-col space-y-1">
            <p className="text-sm font-semibold">Step {index + 1}</p>
            <p className="text-sm text-gray-700">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoSection;
