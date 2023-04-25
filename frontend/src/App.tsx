import { BrowserRouter } from "react-router-dom";
import React from "react";

import ErrorWrapper from "./elements/errors/errorWrapper";
import Routes from "./routes";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes />
      <ErrorWrapper />
    </BrowserRouter>
  );
};

export default App;
