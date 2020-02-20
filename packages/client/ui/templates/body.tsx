import React from "react";
import { Header } from "../organisms/Header";
import { GraphList } from "../organisms/house-temperature/GraphList";
import { Spotify } from "../organisms/spotify/Spotify";

export const App: React.FunctionComponent = () => {
  return (
    <>
      <Header />
      <GraphList />
      <Spotify />
    </>
  );
};
