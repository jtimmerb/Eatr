import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";

import { Recipe } from "../../api/recipe/recipe";
import FadeOut from "../elements/animation/fadeOut";
import RecipeCard from "../elements/cards/recipeCard";
import ThumbButton from "../elements/buttons/thumb-button";
import Container from "../elements/layout/container";
import PageHeader from "../elements/pageHeader";
import EllipsisIcon from "../images/ellipsisIcon";
import RedSolidButton from "../elements/buttons/red-solid-button";
import Modal from "../elements/layout/modal";

const recipe: Recipe = {
  recipeId: 0,
  name: "Chicken Parm",
  steps: ["step1", "step2"],
  image: "https://thestayathomechef.com/wp-content/uploads/2022/08/Best-Chicken-Parmesan-4.jpg",
};

const pop = (array: string[]): string[] =>
  array.filter((_, index) => {
    return index < array.length - 1;
  });



const DiscoverPage: React.FC = () => {
  const [stack, setStack] = useState<Recipe[]>([recipe]);
  const [liked, setLiked] = useState<boolean | undefined>(undefined);
  const [showOptsModal, setShowOptsModal] = useState<boolean>(false);


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
    
    const queue = stack.slice(stack.length - 11, stack.length);
 
  return (
    <div>
      <PageHeader
        backAddr="/home"
        className="pb-8"
        secondaryIcon={
          <button onClick={() => setShowOptsModal(true)}>
            <EllipsisIcon className="w-6 h-6" />
          </button>
        }
      >
        Discovery
      </PageHeader>
      <Container>
        <div className="flex flex-col space-y-8 w-full h-full">
          <div className="relative h-[70vh]">
            <AnimatePresence>
              {queue.map((r) => {
                const isActive = true;

                return <RecipeCard key={r} recipe={r} active={isActive} />;
              })}
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
      </Container>
      {showOptsModal ? (
        <Modal title="Filters" onClose={() => setShowOptsModal(false)}>
          <div className="w-full mt-4">
            <RedSolidButton className="w-full" onClick={() => null}>
              Confirm
            </RedSolidButton>
          </div>
        </Modal>
      ) : null}
    </div>
  );
};

export default DiscoverPage;
