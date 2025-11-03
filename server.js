import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 10000;

// ✅ Ruta principal de estado
app.get("/", (req, res) => {
  res.send("✅ Idexia Metricool API activa y lista para recibir datos.");
});

// 🔧 Función genérica
const getMetrics = async (metricPath) => {
  const baseUrl = "https://app.metricool.com/api";
  const response = await axios.get(`${baseUrl}${metricPath}`, {
    params: {
      start: "20251001",
      end: "20251101",
      timezone: "Europe/Madrid",
      userId: process.env.USER_ID,
      blogId: process.env.BLOG_ID,
    },
    headers: { "X-Mc-Auth": process.env.METRICOOL_TOKEN },
  });
  return response.data;
};

// === META ADS ===
app.get("/api/meta", async (req, res) => {
  try {
    const data = await getMetrics("/stats/timeline/fbAdsPerformance");
    res.json({ platform: "Meta Ads", data });
  } catch (error) {
    res.status(500).json({ platform: "Meta Ads", error: error.message });
  }
});

// === GOOGLE ADS ===
app.get("/api/google", async (req, res) => {
  try {
    const data = await getMetrics("/stats/timeline/adwords_Impressions");
    res.json({ platform: "Google Ads", data });
  } catch (error) {
    res.status(500).json({ platform: "Google Ads", error: error.message });
  }
});

// === TIKTOK ADS ===
app.get("/api/tiktok", async (req, res) => {
  try {
    const data = await getMetrics("/stats/timeline/tiktokAdsPerformance");
    res.json({ platform: "TikTok Ads", data });
  } catch (error) {
    res.status(500).json({ platform: "TikTok Ads", error: error.message });
  }
});

// === LINKEDIN ADS ===
app.get("/api/linkedin", async (req, res) => {
  try {
    const data = await getMetrics("/stats/timeline/linkedinAdsPerformance");
    res.json({ platform: "LinkedIn Ads", data });
  } catch (error) {
    res.status(500).json({ platform: "LinkedIn Ads", error: error.message });
  }
});

// === YOUTUBE ADS ===
app.get("/api/youtube", async (req, res) => {
  try {
    const data = await getMetrics("/stats/timeline/youtubeAdsPerformance");
    res.json({ platform: "YouTube Ads", data });
  } catch (error) {
    res.status(500).json({ platform: "YouTube Ads", error: error.message });
  }
});

// === SEO / Web Metrics ===
app.get("/api/web", async (req, res) => {
  try {
    const data = await getMetrics("/stats/timeline/visits");
    res.json({ platform: "Website", data });
  } catch (error) {
    res.status(500).json({ platform: "Website", error: error.message });
  }
});

// === TODAS LAS PLATAFORMAS ===
app.get("/api/all", async (req, res) => {
  try {
    const [meta, google, tiktok, linkedin, youtube, web] = await Promise.allSettled([
      getMetrics("/stats/timeline/fbAdsPerformance"),
      getMetrics("/stats/timeline/adwords_Impressions"),
      getMetrics("/stats/timeline/tiktokAdsPerformance"),
      getMetrics("/stats/timeline/linkedinAdsPerformance"),
      getMetrics("/stats/timeline/youtubeAdsPerformance"),
      getMetrics("/stats/timeline/visits"),
    ]);

    res.json({
      meta: meta.value || { error: meta.reason?.message },
      google: google.value || { error: google.reason?.message },
      tiktok: tiktok.value || { error: tiktok.reason?.message },
      linkedin: linkedin.value || { error: linkedin.reason?.message },
      youtube: youtube.value || { error: youtube.reason?.message },
      web: web.value || { error: web.reason?.message },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`)
);
