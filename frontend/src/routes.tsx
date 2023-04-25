import React, { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

import LandingPage from "./pages/landing-page";
import ErrorPage from "./pages/error-page";
import LoginPage from "./pages/loginPage";
import SignUpPage from "./pages/signupPage";
import UserHomePage from "./pages/userHomePage";
import SavedRecipesPage from "./pages/savedRecipesPage";
import UserPantryPage from "./pages/userPantryPage";
import DiscoverPage from "./pages/discoverPage";
import { RootState } from "./state";
import { useSelector } from "react-redux";

const NO_USER_PATHS = ["/", "/login", "/signup"];

const Router: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { userId } = useSelector((state: RootState) => state.user);

  console.log(location.pathname);
  useEffect(() => {
    if (userId === undefined && !NO_USER_PATHS.includes(location.pathname))
      navigate("/");
  }, [location.pathname]);

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/home" element={<UserHomePage />} />
      <Route path="/pantry" element={<UserPantryPage />} />
      <Route path="/*" element={<ErrorPage />} />
    </Routes>
  );
};

export default Router;
