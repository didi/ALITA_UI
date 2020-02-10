import React from "react";
import { HashRouter } from "react-router-dom";
import Layout from "./layouts";
import Page from "./pages";
import "./App.less";

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Page />
      </Layout>
    </HashRouter>
  );
};

export default App;
