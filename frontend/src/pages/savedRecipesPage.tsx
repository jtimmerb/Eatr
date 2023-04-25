import { useSelector } from "react-redux";
// import { selectName, selectId } from "../state/user/user";
import { useNavigate } from "react-router-dom";
import PageHeader from "../elements/pageHeader";
import Container from "../elements/layout/container";
import RedSolidButton from "../elements/buttons/red-solid-button";
import SavedRecipeCard from "../elements/layout/savedRecipeCard";

interface IProps {}

interface IRecipe {
  name: string;
}

const SavedRecipesPage: React.FC<IProps> = () => {
  const navigate = useNavigate();

  const navFindRec = () => {
    console.log("findrec");
    // navigate();
  };

  const recipes: IRecipe[] = [
    {
      name: "Chicken Parmesian",
    },
    {
      name: "Mushroom Risotto",
    },
    {
      name: "Sunday Gravy",
    },
    {
      name: "Chicken Parmesian1",
    },
    {
      name: "Mushroom Risotto1",
    },
    {
      name: "Sunday Gravy1",
    },
    {
      name: "Chicken Parmesian2",
    },
    {
      name: "Mushroom Risotto2",
    },
    {
      name: "Sunday Gravy2",
    },
  ];

  return (
    <Container>
      <PageHeader backAddr="/userhome">Saved Recipes</PageHeader>
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
            />
          ))}
        </div>
      )}
      <div className="flex justify-center">
        <div className="absolute bottom-12">
          <RedSolidButton onClick={navFindRec}>Discover Recipes</RedSolidButton>
        </div>
      </div>
    </Container>
  );
};

export default SavedRecipesPage;
