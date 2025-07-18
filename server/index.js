import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_TOKEN;

app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt?.trim()) {
    return res.status(400).json({ error: "Prompt is required" });
  }
  console.log("➡️ Received prompt:", prompt);

  try {
    const response = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: "sonar",
        return_images: true,
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    console.log("🧾 Perplexity response data:", JSON.stringify(response.data, null, 2));


    const images = response.data.images || (response.data.choices && response.data.choices[0].images);
    const imageUrl = images?.[0]?.image_url || null;

    if (!imageUrl) {
      throw new Error("No image returned from Perplexity");
    }

    console.log("✅ Output:", imageUrl);
    res.json({ url: imageUrl }); // Keep `url` as key
  } catch (error) {
    console.error("❌ Generation failed:", error?.response?.data || error.message);
    res.status(500).json({ error: error.message || "Failed to generate image" });
  }
});

// ✅ NEW: proxy route to serve image bypassing CORS
app.get("/proxy", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("Missing url param");

  try {
    const imageResponse = await axios.get(url, { responseType: "stream" });
    res.setHeader("Content-Type", imageResponse.headers["content-type"]);
    imageResponse.data.pipe(res);
  } catch (err) {
    console.error("❌ Proxy error:", err.message);
    res.status(500).send("Failed to load image");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ API running at http://localhost:${PORT}`);
});
