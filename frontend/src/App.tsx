import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";

import LandingPage from "./pages/landing-page";
import ErrorPage from "./pages/error-page";
import LoginPage from "./pages/loginPage";
import SignUpPage from "./pages/signupPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";

import LandingPage from "./pages/landing-page";
import ErrorPage from "./pages/error-page";
import LoginPage from "./pages/loginPage";
import SignUpPage from "./pages/signupPage";
import UserHome from "./pages/userHomePage";
import SavedRecipesPage from "./pages/savedRecipesPage";
import UserPantryPage from "./pages/userPantryPage";
import DiscoverPage from "./pages/discoverPage";
import React from "react";

export default function App() {
  return <RouterProvider router={router} />;
}
