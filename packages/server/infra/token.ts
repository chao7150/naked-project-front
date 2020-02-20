import * as IoRedis from "ioredis";
import axios from "axios";
import { SPOTIFY_ACCOUNT_ENDPOINT } from "./consts";

type TokenRequestResponse = {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
};

type Conf = {
  redisHostName: string;
  redisPort: number;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  code: string;
};

// eslint-disable-next-line
const conf: Conf = require("../../../config/conf.json");
const redis =
  process.env.NODE_ENV === "production"
    ? new IoRedis(conf.redisPort, conf.redisHostName)
    : new IoRedis();

export const refreshToken = async (): Promise<void> => {
  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  const refreshToken = await redis.get("refreshToken");
  // TODO: モナドでどうにかしたい
  if (refreshToken === null) {
    console.error("failed to load refreshToken");
    process.exit(1);
  }
  params.append("refresh_token", refreshToken);

  const encodedIdAndSecret = Buffer.from(
    `${conf.clientId}:${conf.clientSecret}`,
  ).toString("base64");

  const { data } = await axios
    .post<Omit<TokenRequestResponse, "refresh_token">>(
      SPOTIFY_ACCOUNT_ENDPOINT,
      params,
      {
        headers: {
          Authorization: `Basic ${encodedIdAndSecret}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    )
    .catch(e => {
      console.error(e);
      process.exit(1);
    });
  redis.set("accessToken", data.access_token);
};

export const getToken = async (): Promise<string> => {
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", conf.code);
  params.append("redirect_uri", conf.redirectUri);

  const encodedIdAndSecret = Buffer.from(
    `${conf.clientId}:${conf.clientSecret}`,
  ).toString("base64");

  const { data, ...meta } = await axios
    .post<TokenRequestResponse>(SPOTIFY_ACCOUNT_ENDPOINT, params, {
      headers: {
        Authorization: `Basic ${encodedIdAndSecret}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .catch(e => {
      console.error(e);
      process.exit(1);
    });
  if (meta.status !== 200) {
    process.exit(1);
  }
  await redis.set("accessToken", data.access_token);
  await redis.set("refreshToken", data.refresh_token);
  setInterval(refreshToken, data.expires_in * 0.8 * 1000);
  return data.access_token;
};

export const token = async (): Promise<string> => {
  const accessToken = await redis.get("accessToken").catch(e => {
    console.error(e);
    process.exit(1);
  });
  if (accessToken) {
    return accessToken;
  }
  const hoge = await getToken();
  return hoge;
};
