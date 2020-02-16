import { rawCurrentlyPlayingObject } from "../../common/const";
import axios from "axios";

export async function fetchNowPlaying(): Promise<rawCurrentlyPlayingObject> {
  const endPoint =
    process.env.NODE_ENV === "production"
      ? "https://sencha.chao.tokyo/"
      : "http://localhost:3000/";
  const { data } = await axios.get<rawCurrentlyPlayingObject>(
    `${endPoint}api/nowPlaying`,
  );
  return data;
}
