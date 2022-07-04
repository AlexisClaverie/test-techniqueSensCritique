const { MysqlConnection } = require("../../repository/MysqlConnection");
const Anime = require("../../models/animes")(MysqlConnection);

export default async (req, res) => {
  if (req.method === "POST") {
    try {
      const newAnime = await Anime.create({
        english: req.body.title.english,
        romaji: req.body.title.romaji,
      });
      console.log("Saved !");
      res.status(202).send(newAnime);
    } catch (error) {
      console.log({ message: error.message });
    }
  }

  if (req.method === "GET") {
    try {
      const allResponse = await Anime.findAll();
      res.status(202).json(allResponse);
    } catch (error) {
      console.log({ message: error.message });
    }
  }
};
