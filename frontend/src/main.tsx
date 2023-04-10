import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/homePage";
import Login from "./pages/loginPage";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" Component={Home} />
      <Route path="/login" Component={Login} />
    </Routes>
  </BrowserRouter>
);
