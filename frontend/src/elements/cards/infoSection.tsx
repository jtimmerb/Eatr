import React from "react";

interface IProps {
  ingredients: string[];
  steps: string[];
}

const InfoSection: React.FC<IProps> = (props) => {
  const {ingredients, steps} = props;

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-2">
        <h3 className="font-bold text-xl pb-1">Ingredients</h3> 
        {ingredients.map((ingredient) => (
          <p className="text-sm text-gray-700">{ingredient}</p>
        ))}
        
      </div>

      <div className="flex flex-col space-y-2">
        <h3 className="font-bold text-xl pb-1">Preparations</h3>
        {steps.map((step, index) => (
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold">Step {index + 1}</p>
            <p className="text-sm text-gray-700">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoSection;
