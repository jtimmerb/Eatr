import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import PageHeader from "../elements/pageHeader";

import { Recipe } from "../../api/recipe/recipe";
import FadeOut from "../elements/animation/fadeOut";
import RecipeCard from "../elements/cards/recipeCard";
import ThumbButton from "../elements/buttons/thumb-button";

const recipe: Recipe = {
  recipeId: 0,
  name: "chicken",
  steps: ["step1", "step2"],
  image: "",
};

const pop = (array: string[]): string[] =>
  array.filter((_, index) => {
    return index < array.length - 1;
  });



const DiscoverPage: React.FC = () => {
  const [stack, setStack] = useState<Recipe[]>([recipe]);
  const [liked, setLiked] = useState<boolean | undefined>(undefined);

  // Handle swipe
  const onChange = (like: boolean) => {
    setLiked(like);
  };

  const outOfRecipes = stack.length === 0 //&& !partyMovies.pending;

  if (outOfRecipes)
    return (
      <div className="flex flex-col align-center justify-center w-full h-full">
        <FadeOut>
          <p className="text-gray-600 text-center">No more recipes to swipe.</p>
        </FadeOut>
      </div>
    );


  return (
    <div className="flex flex-col space-y-8 w-full h-full">
      <div className="relative h-[70vh]">
        <AnimatePresence>
          <RecipeCard recipe={stack[0]}/>
        </AnimatePresence>
      </div>

      <FadeOut standalone>
        <div className="flex flex-row justify-center">
          <div className="flex flex-row space-x-16">
            <ThumbButton onClick={() => onChange(false)} />
            <button></button>
            <ThumbButton onClick={() => onChange(true)} variant="like" />
          </div>
        </div>
      </FadeOut>
    </div>
  );
};

export default DiscoverPage;
