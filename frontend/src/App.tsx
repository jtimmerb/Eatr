import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/homePage";
import Login from "./pages/loginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/login" Component={Login} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
