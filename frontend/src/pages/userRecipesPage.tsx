import { useNavigate } from "react-router-dom";
import PageHeader from "../elements/pageHeader";
import Container from "../elements/layout/container";
import RedSolidButton from "../elements/buttons/red-solid-button";
import SavedRecipeCard from "../elements/layout/savedRecipeCard";

interface IProps {}

interface IRecipe {
  name: string;
}

const UserRecipesPage: React.FC<IProps> = () => {
  const navigate = useNavigate();

  const navCreateRec = () => {
    console.log("create");
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
  ];

  return (
    <Container>
      <PageHeader backAddr="/userhome">My Recipes</PageHeader>
      {recipes.length == 0 ? (
        <div className="mt-20 flex justify-center text-gray-400">
          You have not created any recipes yet
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
          <RedSolidButton onClick={navCreateRec}>Create</RedSolidButton>
        </div>
      </div>
    </Container>
  );
};

export default UserRecipesPage;
