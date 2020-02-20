import axios from "axios";
import { token, refreshToken } from "./token";
import { rawCurrentlyPlayingObject } from "../../common/const";

export const fetchMusicData = async (): Promise<
  rawCurrentlyPlayingObject | undefined
> => {
  const accessToken = await token();
  try {
    const { data, ...meta } = await axios.get<rawCurrentlyPlayingObject>(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    if (meta.status === 204) {
      return undefined;
    }
    return data;
  } catch (e) {
    if (e.response.status === 401) {
      await refreshToken();
      return fetchMusicData();
    }

    console.error(e);
    throw new Error("fetch failed");
  }
};
