import React from "react";
import { Header } from "../organisms/Header";
import { GraphList } from "../organisms/house-temperature/GraphList";

export const App: React.FunctionComponent = () => {
  return (
    <>
      <Header />
      <GraphList />
    </>
  );
};
