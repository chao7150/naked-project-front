const axios = require("axios");

const execSync = require("child_process").execSync;

const payload = `grant_type=authorization_code&code=${process.env.CODE}&redirect_uri=${process.env.REDIRECT_URI}`;
const encodedIdAndSecret = Buffer.from(
  `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`,
).toString("base64");
console.log(
  `curl -X POST -H "Authorization: Basic ${encodedIdAndSecret}" -d "${payload}" https://accounts.spotify.com/api/token`,
);
const params = new URLSearchParams();
params.append("grant_type", "authorization_code");
params.append("code", process.env.CODE!);
params.append("redirect_uri", process.env.REDIRECT_URI!);
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
