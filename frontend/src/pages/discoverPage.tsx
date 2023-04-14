import { useSelector, useDispatch } from "react-redux";
import PageHeader from "../elements/pageHeader";

const DiscoverPage = (): JSX.Element => {
  return (
    <>
      <PageHeader pageName="Discovery" backAddr="/userhome" />
    </>
  );
};

export default DiscoverPage;
