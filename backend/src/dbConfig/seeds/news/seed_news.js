import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imageDirectory = path.join(__dirname, "/images");
const getImages = () => {
  return fs
    .readdirSync(imageDirectory)
    .filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file)); // Only include images
};

export const seed = async function (knex) {
  try {
    // Clear existing data
    await knex("news_tags").del();
    await knex("tags").del();
    await knex("news").del();

    // Sample news data
    let newsData = [];
    const images = getImages();

    for (let i = 0; i <= 11; i++) {
      const imageIndex = i % images.length;
      const newTechData = {
        title: `Tech House ${i + 1}`,
        text: `Tech Text ${i + 1}`,
        picture: images[imageIndex],
        tags: ["Tech"],
        likes: 0,
        dislikes: 0,
      };
      const newPoliticsData = {
        title: `Politics House ${i + 1}`,
        text: `Politics Text ${i + 1}`,
        picture: images[imageIndex],
        tags: ["Politics"],
        likes: 0,
        dislikes: 0,
      };
      const newFinanceData = {
        title: `Finance House ${i + 1}`,
        text: `Finance Text ${i + 1}`,
        picture: images[imageIndex],
        tags: ["Finance"],
        likes: 0,
        dislikes: 0,
      };

      newsData.push(newTechData, newPoliticsData, newFinanceData);
    }

    for (const news of newsData) {
      const [newsId] = await knex("news")
        .insert({
          title: news.title,
          text: news.text,
          picture: news.picture,
          likes: 0,
          dislikes: 0,
        })
        .returning("id");

      // Ensure newsId is an integer
      const parsedNewsId = parseInt(newsId.id, 10);

      if (isNaN(parsedNewsId)) {
        throw new Error(`Invalid newsId value: ${newsId}`);
      }

      // Insert tags and associate with news
      for (const tag of news.tags) {
        let tagId;

        // Check if the tag already exists
        const existingTag = await knex("tags").where({ name: tag }).first();

        if (existingTag) {
          tagId = existingTag.id;
        } else {
          const [newTagId] = await knex("tags")
            .insert({ name: tag })
            .returning("id");
          tagId = newTagId.id;
        }

        // Ensure tagId is an integer
        const parsedTagId = parseInt(tagId, 10);

        if (isNaN(parsedTagId)) {
          throw new Error(`Invalid tagId value: ${tagId}`);
        }

        // Link news with tags
        await knex("news_tags")
          .insert({ news_id: parsedNewsId, tag_id: parsedTagId })
          .onConflict(["news_id", "tag_id"])
          .ignore();
      }
    }
    console.log("✅ Database seeding complete!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
};
