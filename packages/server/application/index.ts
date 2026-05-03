import path from "node:path";
import compression from "compression";
import express from "express";

const app = express();

app.use(compression());
app.use(express.static(path.join(__dirname, "../dist")));
app.get("/", (req, res) => {
  const options = {
    root: path.join(__dirname, "../dist"),
  };
  res.sendFile("index.html", options);
});
app.listen(3000);
