import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/homePage";
import Login from "./pages/loginPage";
import SignUp from "./pages/signupPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/login" Component={Login} />
        <Route path="/signup" Component={SignUp} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
