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

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "login",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "signup",
    element: <SignUpPage />,
    errorElement: <ErrorPage />,
  },
<<<<<<< HEAD
=======
  {
    path: "home",
    element: <UserHome />,
    errorElement: <ErrorPage />,
  },
  {
    path: "pantry",
    element: <UserPantryPage />,
    errorElement: <ErrorPage />,
  },
>>>>>>> 675b6bc (create both pantry modals for creation and options (#21))
]);

export default function App() {
  return <RouterProvider router={router} />;
}
