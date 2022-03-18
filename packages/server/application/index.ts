import express from "express";
import path from "path";
import compression from "compression";

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
