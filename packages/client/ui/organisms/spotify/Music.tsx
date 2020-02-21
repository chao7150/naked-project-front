import React from "react";
import { Music } from "../../../domain/Music";

export const MusicComponent: React.FC<Music> = ({
  imageUrl,
  spotifyUrl,
  name,
  artists,
}) => {
  const artistsString = artists ? artists.join(" / ") : "";
  return (
    <>
      <img src={imageUrl} alt="" />
      <a href={spotifyUrl}>{name}</a>
      <span>{` by ${artistsString}`}</span>
    </>
  );
};
