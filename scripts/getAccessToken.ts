const axios = require("axios");

const execSync = require("child_process").execSync;

const conf = require("../config/conf.json");

const payload = `grant_type=authorization_code&code=${conf.code}&redirect_uri=${conf.redirectUri}`;
const encodedIdAndSecret = Buffer.from(
  `${conf.clientId}:${conf.clientSecret}`,
).toString("base64");
console.log(
  `curl -X POST -H "Authorization: Basic ${encodedIdAndSecret}" -d "${payload}" https://accounts.spotify.com/api/token`,
);
const params = new URLSearchParams();
params.append("grant_type", "authorization_code");
params.append("code", conf.code);
params.append("redirect_uri", conf.redirectUri);
axios
  .post("https://accounts.spotify.com/api/token", params, {
    headers: {
      Authorization: `Basic ${encodedIdAndSecret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .then(r => console.log(r));

// console.log(
//   execSync(
//     `curl -X POST -H "Authorization: Basic ${encodedIdAndSecret}" -d "${payload}" https://accounts.spotify.com/api/token`,
//   ),
// );
