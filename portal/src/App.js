import React from "react";

import Routes from "./routes";
import { Provider } from "./Context";

import "./App.css";

import "antd/dist/antd.css";

function App() {
  return (
    <Provider>
      <Routes />
    </Provider>
  );
}

export default App;