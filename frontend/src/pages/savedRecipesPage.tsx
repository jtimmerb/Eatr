import { useSelector } from "react-redux";
// import { selectName, selectId } from "../state/user/user";
import Modal from "../elements/layout/modal";
import { useNavigate } from "react-router-dom";
import PageHeader from "../elements/pageHeader";
import Container from "../elements/layout/container";
import RedSolidButton from "../elements/buttons/red-solid-button";
import SavedRecipeCard from "../elements/layout/savedRecipeCard";
import { useAppDispatch } from "../state";
import { useState } from "react";

import { deleteRecipe } from "../state/recipes/recipes";

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
    console.log("findrec");
    navigate("/discover");
  };

  const handleShowDeleteRecipe = (index: number) => {
    setShowDeleteModal(true);
    setIndex(index);
    setDescription(recipes[index].description);
    setName(recipes[index].name);
  };

  const handleDeleteRecipe = (index: number) => {
    const updatedRecipes = [...recipes];
    updatedRecipes.splice(index, 1);
    setRecipes(updatedRecipes);
    setShowDeleteModal(false);
    dispatch(deleteRecipe({ recipeID: recipes[index].id }));
  };

  const handleExpandRecipe = (index: number) => {
    setDescription(recipes[index].description);
    setName(recipes[index].name);
    setShowDescription(true);
  };

  const [name, setName] = useState("");
  const [index, setIndex] = useState(0);
  const [description, setDescription] = useState("");
  const [showDescription, setShowDescription] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [recipes, setRecipes] = useState<IRecipe[]>([
    {
      id: 1,
      name: "Chicken Parmesan",
      description:
        "Combine 1 Tbsp. salt and 10 cups water in a medium pot. \
        Bring to a boil, then reduce heat to medium to maintain a bare simmer.Combine 1 Tbsp.\
         salt and 10 cups water in a medium pot. Bring to a boil, then reduce heat to medium to maintain a bare simmer.\
         Combine 1 Tbsp. salt and 10 cups water in a medium pot. Bring to a boil, then reduce heat to medium to maintain a bare simmer.\
         Combine 1 Tbsp. salt and 10 cups water in a medium pot. Bring to a boil, then reduce heat to medium to maintain a bare simmer.",
    },
    {
      id: 1,
      name: "Mushroom Risotto",
      description:
        "Combine 1 Tbsp. salt and 10 cups water in a medium pot. Bring to a boil, then reduce heat to medium to maintain a bare simmer.",
    },
    {
      id: 1,
      name: "Sunday Gravy",
      description:
        "Combine 1 Tbsp. salt and 10 cups water in a medium pot. Bring to a boil, then reduce heat to medium to maintain a bare simmer.",
    },
    {
      id: 1,
      name: "Chicken Parmesan1",
      description:
        "Combine 1 Tbsp. salt and 10 cups water in a medium pot. Bring to a boil, then reduce heat to medium to maintain a bare simmer.",
    },
    {
      id: 1,
      name: "Mushroom Risotto1",
      description:
        "Combine 1 Tbsp. salt and 10 cups water in a medium pot. Bring to a boil, then reduce heat to medium to maintain a bare simmer.",
    },
    {
      id: 1,
      name: "Sunday Gravy1",
      description:
        "Combine 1 Tbsp. salt and 10 cups water in a medium pot. Bring to a boil, then reduce heat to medium to maintain a bare simmer.",
    },
    {
      id: 1,
      name: "Chicken Parmesan2",
      description:
        "Combine 1 Tbsp. salt and 10 cups water in a medium pot. Bring to a boil, then reduce heat to medium to maintain a bare simmer.",
    },
    {
      id: 1,
      name: "Mushroom Risotto2",
      description:
        "Combine 1 Tbsp. salt and 10 cups water in a medium pot. Bring to a boil, then reduce heat to medium to maintain a bare simmer.",
    },
    {
      id: 1,
      name: "Sunday Gravy2",
      description:
        "Combine 1 Tbsp. salt and 10 cups water in a medium pot. Bring to a boil, then reduce heat to medium to maintain a bare simmer.",
    },
  ]);

  return (
    <>
      <Container>
        <PageHeader backAddr="/home">Saved Recipes</PageHeader>
        {recipes.length == 0 ? (
          <div className="mt-20 flex justify-center text-gray-400">
            You do not have any liked recipes yet
          </div>
        ) : (
          <div className="flex flex-col flex-nowrap max-h-[40rem] overflow-y-scroll mt-4 py-2">
            {recipes.map((recipe, i) => (
              <SavedRecipeCard
                key={recipe.name}
                hasMargin={i > 0}
                title={recipe.name}
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
        <Modal
          onClose={() => {
            setShowDescription(false);
          }}
          title={name}
        >
          <div className="text-sm">{description}</div>
        </Modal>
      ) : null}
      {showDeleteModal ? (
        <Modal
          onClose={() => {
            setShowDeleteModal(false);
          }}
          title="Remove Recipe"
        >
          Remove {name} from saved recipes?
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
