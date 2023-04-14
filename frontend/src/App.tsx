import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/homePage";
import Login from "./pages/loginPage";
import SignUp from "./pages/signupPage";
import userHome from "./pages/userHomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/login" Component={Login} />
        <Route path="/signup" Component={SignUp} />
        <Route path="/userhome" Component={userHome} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
