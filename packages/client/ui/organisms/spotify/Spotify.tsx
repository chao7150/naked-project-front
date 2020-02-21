import React, { useState, useEffect } from "react";
import { rawCurrentlyPlayingObject } from "../../../../common/const";
import { fetchNowPlaying } from "../../../infra/fetchNowPlaying";
import { Music } from "../../../domain/Music";
import { MusicComponent } from "./Music";

const createMusicObject = (
  rawMusic: rawCurrentlyPlayingObject,
): Music | undefined => {
  if (!(rawMusic.item && rawMusic.item.name)) {
    return undefined;
  }
  return {
    name: rawMusic.item.name,
    artists: rawMusic.item.artists.map(artist => artist.name),
    spotifyUrl: rawMusic.item.external_urls.spotify,
    imageUrl: rawMusic.item.album.images[0]?.url,
  };
};

export const Spotify: React.FC = () => {
  const [music, setMusic] = useState<Music | undefined>(undefined);
  useEffect(() => {
    const fetch = async (): Promise<void> => {
      const nowPlaying = await fetchNowPlaying();
      setMusic(createMusicObject(nowPlaying));
    };
    fetch();
    setInterval(fetch, 30 * 1000);
  }, []);
  return (
    <>
      <h1>ちゃおが今聴いている音楽</h1>
      {music ? <MusicComponent {...music} /> : <span>なし</span>}
    </>
  );
};
