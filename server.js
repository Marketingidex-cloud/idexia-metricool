import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send("✅ Idexia Metricool API activa y lista para recibir datos.");
});

// === META ADS ===
app.get("/api/meta", async (req, res) => {
  try {
    const response = await axios.get("https://app.metricool.com/api/stats/aggregations/fbAdsPerformance", {
      params: {
        start: "20251001",
        end: "20251101",
        timezone: "Europe/Madrid",
        userId: process.env.USER_ID,
        blogId: process.env.BLOG_ID
      },
      headers: { "X-Mc-Auth": process.env.METRICOOL_TOKEN }
    });

    res.json({
      cpm: response.data.cpm,
      cpc: response.data.cpc,
      ctr: response.data.ctr
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// === GOOGLE ADS ===
app.get("/api/google", async (req, res) => {
  try {
    const response = await axios.get("https://app.metricool.com/api/stats/aggregations/googleAdsPerformance", {
      params: {
        start: "20251001",
        end: "20251101",
        timezone: "Europe/Madrid",
        userId: process.env.USER_ID,
        blogId: process.env.BLOG_ID
      },
      headers: { "X-Mc-Auth": process.env.METRICOOL_TOKEN }
    });

    res.json({
      cpm: response.data.cpm,
      cpc: response.data.cpc,
      ctr: response.data.ctr
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// === TIKTOK ADS ===
app.get("/api/tiktok", async (req, res) => {
  try {
    const response = await axios.get("https://app.metricool.com/api/stats/aggregations/tiktokAdsPerformance", {
      params: {
        start: "20251001",
        end: "20251101",
        timezone: "Europe/Madrid",
        userId: process.env.USER_ID,
        blogId: process.env.BLOG_ID
      },
      headers: { "X-Mc-Auth": process.env.METRICOOL_TOKEN }
    });

    res.json({
      cpm: response.data.cpm,
      cpc: response.data.cpc,
      ctr: response.data.ctr
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// === LINKEDIN ADS ===
app.get("/api/linkedin", async (req, res) => {
  try {
    const response = await axios.get("https://app.metricool.com/api/stats/aggregations/linkedinAdsPerformance", {
      params: {
        start: "20251001",
        end: "20251101",
        timezone: "Europe/Madrid",
        userId: process.env.USER_ID,
        blogId: process.env.BLOG_ID
      },
      headers: { "X-Mc-Auth": process.env.METRICOOL_TOKEN }
    });

    res.json({
      cpm: response.data.cpm,
      cpc: response.data.cpc,
      ctr: response.data.ctr
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// === YOUTUBE ADS ===
app.get("/api/youtube", async (req, res) => {
  try {
    const response = await axios.get("https://app.metricool.com/api/stats/aggregations/youtubeAdsPerformance", {
      params: {
        start: "20251001",
        end: "20251101",
        timezone: "Europe/Madrid",
        userId: process.env.USER_ID,
        blogId: process.env.BLOG_ID
      },
      headers: { "X-Mc-Auth": process.env.METRICOOL_TOKEN }
    });

    res.json({
      cpm: response.data.cpm,
      cpc: response.data.cpc,
      ctr: response.data.ctr
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
});
