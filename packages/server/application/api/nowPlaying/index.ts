import express from "express";
import { fetchMusicData } from "../../../infra/fetchMusicData";

export const router = express.Router();
router.get("/", async (req, res) => {
  try {
    const music = await fetchMusicData();
    if (music) {
      res.status(200).json(music);
    } else {
      res.sendStatus(204);
    }
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});
