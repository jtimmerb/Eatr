import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/homePage";
import Login from "./pages/loginPage";
import SignUp from "./pages/signupPage";
import UserHome from "./pages/userHomePage";
import SavedRecipesPage from "./pages/savedRecipesPage";
import UserRecipePage from "./pages/userPantryPage";
import DiscoverPage from "./pages/discoverPage";
import React from "react";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/login" Component={Login} />
        <Route path="/signup" Component={SignUp} />
        <Route path="/userhome" Component={UserHome} />
        <Route path="/savedrecipes" Component={SavedRecipesPage} />
        <Route path="/myrecipes" Component={UserRecipePage} />
        <Route path="/discover" Component={DiscoverPage} />
      </Routes>
    </BrowserRouter>
  );
}
