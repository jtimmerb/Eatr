import { useSelector } from "react-redux";
// import { selectName, selectId } from "../state/user/user";
import Modal from "../elements/layout/modal";
import { useNavigate } from "react-router-dom";
import PageHeader from "../elements/pageHeader";
import Container from "../elements/layout/container";
import RedSolidButton from "../elements/buttons/red-solid-button";
import SavedRecipeCard from "../elements/layout/savedRecipeCard";
import { RootState, useAppDispatch } from "../state";
import { useEffect, useState } from "react";

import { deleteRecipe, listSavedRecipes } from "../state/recipes/recipes";
import Backdrop from "../elements/layout/backdrop";
import RecipeCard from "../elements/cards/recipeCard";

interface IProps {}

interface IRecipe {
  id: number;
  name: string;
  description: string;
}

const SavedRecipesPage: React.FC<IProps> = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const navFindRec = () => {
    navigate("/discover");
  };

  const handleShowDeleteRecipe = (index: number) => {
    setShowDeleteModal(true);
    setIndex(index);
  };

  const handleDeleteRecipe = (index: number) => {
    setShowDeleteModal(false);
    dispatch(deleteRecipe({ recipeID: savedRecipes[index].recipeId }))
      .unwrap()
      .then(() => dispatch(listSavedRecipes({})));
  };

  const handleExpandRecipe = (index: number) => {
    setShowDescription(true);
    setIndex(index);
  };

  const [index, setIndex] = useState(0);
  const [showDescription, setShowDescription] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { savedRecipes } = useSelector((state: RootState) => state.recipes);

  useEffect(() => {
    dispatch(listSavedRecipes({}));
  }, []);

  const curRecipe =
    savedRecipes.length > index ? savedRecipes[index] : undefined;

  return (
    <>
      <Container>
        <PageHeader backAddr="/home">Saved Recipes</PageHeader>
        {savedRecipes.length == 0 ? (
          <div className="mt-20 flex justify-center text-gray-400">
            You do not have any liked recipes yet
          </div>
        ) : (
          <div className="flex flex-col flex-nowrap max-h-[40rem] overflow-y-scroll mt-4 py-2">
            {savedRecipes.map((recipe, i) => (
              <SavedRecipeCard
                key={recipe.recipeId}
                hasMargin={i > 0}
                title={recipe.name}
                image={recipe.image}
                onDelete={() => handleShowDeleteRecipe(i)}
                onExpand={() => handleExpandRecipe(i)}
              />
            ))}
          </div>
        )}
        <div className="flex justify-center">
          <div className="absolute bottom-12">
            <RedSolidButton onClick={navFindRec}>
              Discover Recipes
            </RedSolidButton>
          </div>
        </div>
      </Container>
      {showDescription ? (
        <Backdrop onClose={() => setShowDescription(false)}>
          <Container>
            <div className="flex flex-col space-y-8 w-full h-full">
              <div className="relative h-[70vh] mt-[10vh]">
                {curRecipe ? <RecipeCard recipe={curRecipe} /> : null}
              </div>
            </div>
          </Container>
        </Backdrop>
      ) : null}
      {showDeleteModal ? (
        <Modal
          onClose={() => {
            setShowDeleteModal(false);
          }}
          title="Remove Recipe"
        >
          Remove {curRecipe?.name} from saved recipes?
          <RedSolidButton
            className="mt-4 w-full"
            onClick={() => handleDeleteRecipe(index)}
          >
            Remove
          </RedSolidButton>
        </Modal>
      ) : null}
    </>
  );
};

export default SavedRecipesPage;
