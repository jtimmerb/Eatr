import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";

import { Recipe } from "../api/recipe";
import FadeOut from "../elements/animation/fadeOut";
import RecipeCard from "../elements/cards/recipeCard";
import ThumbButton from "../elements/buttons/thumb-button";
import Container from "../elements/layout/container";
import PageHeader from "../elements/pageHeader";
import EllipsisIcon from "../images/ellipsisIcon";
import RedSolidButton from "../elements/buttons/red-solid-button";
import Modal from "../elements/layout/modal";
import { RootState, useAppDispatch } from "../state";
import {
  listRecipes,
  saveRecipe,
  addSwipedID,
  resetSwiped,
} from "../state/recipes/recipes";
import { listItems } from "../state/pantry/pantry";

const pop = (array: Recipe[]): Recipe[] =>
  array.filter((_, index) => {
    return index < array.length - 1;
  });

const DiscoverPage: React.FC = () => {
  const [stack, setStack] = useState<Recipe[]>([]);
  const [liked, setLiked] = useState<boolean | undefined>(undefined);
  const [showOptsModal, setShowOptsModal] = useState<boolean>(false);

  const curRecipeId = stack.length ? stack[stack.length - 1].recipeId : null;

  const dispatch = useAppDispatch();

  const { items } = useSelector((state: RootState) => state.pantry);
  const { recipes, swipedIDs } = useSelector(
    (state: RootState) => state.recipes
  );

  // Fetch user ingredients
  useEffect(() => {
    dispatch(listItems({}));

    // TODO: Disable this when not debugging
    dispatch(resetSwiped());
  }, []);

  // Fetch recipes
  useEffect(() => {
    if (items.length)
      dispatch(listRecipes({ ingredientIDs: items.map((item) => item.id) }));
  }, [items]);

  // Filter recipes
  useEffect(() => {
    setStack(recipes.filter((recipe) => !swipedIDs.includes(recipe.recipeId)));
  }, [recipes, swipedIDs]);

  // Handle swipe
  const onChange = (like: boolean) => {
    setLiked(like);
  };

  // Handle a swipe
  useEffect(() => {
    if (liked !== undefined && curRecipeId) {
      setStack(pop(stack)); // Change redux state
      if (liked) {
        dispatch(saveRecipe({ recipeId: curRecipeId }));
      }
      dispatch(addSwipedID(curRecipeId));
    }
  }, [liked]);
  useEffect(() => {
    setLiked(undefined);
  }, [stack]);

  const outOfRecipes = stack.length === 0; //&& !partyMovies.pending;

  const Head = () => (
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
  );

  if (outOfRecipes)
    return (
      <>
        <Head />
        <Container>
          <div className="flex flex-col align-center justify-center w-full h-full">
            <FadeOut>
              <p className="text-gray-600 text-center">
                No more recipes to swipe.
              </p>
            </FadeOut>
          </div>
        </Container>
      </>
    );

  const queue = stack.slice(stack.length - 11, stack.length);

  return (
    <div>
      <Head />
      <Container>
        <div className="flex flex-col space-y-8 w-full h-full">
          <div className="relative h-[70vh]">
            <AnimatePresence>
              {queue.map((r) => {
                const isActive = r.recipeId === curRecipeId;

                return (
                  <RecipeCard
                    key={r.recipeId}
                    liked={isActive ? liked : undefined}
                    recipe={r}
                    hidden={!isActive}
                    active={isActive}
                    onChange={onChange}
                  />
                );
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
