import { rawCurrentlyPlayingObject } from "../../common/const";
import axios from "axios";

export async function fetchNowPlaying(): Promise<rawCurrentlyPlayingObject> {
  const { data } = await axios.get<rawCurrentlyPlayingObject>(
    "http://localhost:3000/api/nowPlaying",
  );
  console.log("chao");
  return data;
}
