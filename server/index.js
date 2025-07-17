import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Replicate from "replicate";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

app.post("/api/generate", async (req, res) => {
  let { prompt } = req.body;

  if (!prompt?.trim()) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  console.log("➡️ Received prompt:", prompt);

  try {
    const output = await replicate.run(
      "stability-ai/sdxl", // model
      {
        input: {
          prompt: prompt,
          width: 1024,
          height: 1024,
        },
      }
    );

    console.log("✅ Output:", output);

    // output is an array of image URLs
    res.json({ url: output[0] });
  } catch (error) {
    console.error("❌ Generation failed:", error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ API running at http://localhost:${PORT}`);
});
