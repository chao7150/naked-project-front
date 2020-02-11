const SpotifyWebApi = require("spotify-web-api-node");
const _open = require("open");
const conf = require("../config/conf");

const scopes = ["user-read-currently-playing"];
const { clientId, clientSecret, redirectUri } = conf;

const spotifyWebApi = new SpotifyWebApi({
  redirectUri,
  clientId,
});

const authorizeURL = spotifyWebApi.createAuthorizeURL(scopes, "chao");
_open(authorizeURL);
console.log(
  "ブラウザで承認し、リダイレクト先のURLのクエリパラメータのcodeをconfigに追記する",
);

export {};
