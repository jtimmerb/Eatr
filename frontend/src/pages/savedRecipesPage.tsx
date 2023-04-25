import { useSelector } from "react-redux";
import { selectName, selectId } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import PageHeader from "../elements/pageHeader";

const SavedRecipesPage = (): JSX.Element => {
  const navigate = useNavigate();

  const navFindRec = () => {
    console.log("findrec");
  };

  return (
    <>
      <PageHeader pageName="Saved Recipes" backAddr="/userhome" />
    </>
  );
};

export default SavedRecipesPage;
