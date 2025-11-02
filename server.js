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

// 🧠 Helper: función genérica para obtener métricas de Ads
const getMetrics = async (url) => {
  const response = await axios.get(url, {
    params: {
      start: "20251001",
      end: "20251101",
      timezone: "Europe/Madrid",
      userId: process.env.USER_ID,
      blogId: process.env.BLOG_ID,
    },
    headers: { "X-Mc-Auth": process.env.METRICOOL_TOKEN },
  });
  return {
    cpm: response.data.cpm,
    cpc: response.data.cpc,
    ctr: response.data.ctr,
  };
};

// === META ADS ===
app.get("/api/meta", async (req, res) => {
  try {
    const data = await getMetrics(
      "https://app.metricool.com/api/stats/aggregations/fbAdsPerformance"
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({
      platform: "Meta Ads",
      error: error.message,
      details: error.response?.data || "Error desconocido",
    });
  }
});

// === GOOGLE ADS ===
app.get("/api/google", async (req, res) => {
  try {
    const data = await getMetrics(
      "https://app.metricool.com/api/stats/aggregations/googleAdsPerformance"
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({
      platform: "Google Ads",
      error: error.message,
      details: error.response?.data || "Error desconocido",
    });
  }
});

// === TIKTOK ADS ===
app.get("/api/tiktok", async (req, res) => {
  try {
    const data = await getMetrics(
      "https://app.metricool.com/api/stats/aggregations/tiktokAdsPerformance"
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({
      platform: "TikTok Ads",
      error: error.message,
      details: error.response?.data || "Error desconocido",
    });
  }
});

// === LINKEDIN ADS ===
app.get("/api/linkedin", async (req, res) => {
  try {
    const data = await getMetrics(
      "https://app.metricool.com/api/stats/aggregations/linkedinAdsPerformance"
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({
      platform: "LinkedIn Ads",
      error: error.message,
      details: error.response?.data || "Error desconocido",
    });
  }
});

// === YOUTUBE ADS ===
app.get("/api/youtube", async (req, res) => {
  try {
    const data = await getMetrics(
      "https://app.metricool.com/api/stats/aggregations/youtubeAdsPerformance"
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({
      platform: "YouTube Ads",
      error: error.message,
      details: error.response?.data || "Error desconocido",
    });
  }
});

// === 🧭 SEO / ANALÍTICA WEB ===
app.get("/api/seo", async (req, res) => {
  try {
    const response = await axios.get(
      "https://app.metricool.com/api/stats/aggregations/webAnalytics",
      {
        params: {
          start: "20251001",
          end: "20251101",
          timezone: "Europe/Madrid",
          userId: process.env.USER_ID,
          blogId: process.env.BLOG_ID,
        },
        headers: { "X-Mc-Auth": process.env.METRICOOL_TOKEN },
      }
    );

    if (!response.data || Object.keys(response.data).length === 0) {
      return res.status(200).json({
        success: false,
        message:
          "⚠️ Acceso REST SEO aún no habilitado por Metricool. Esperando activación.",
      });
    }

    res.json({
      success: true,
      source: "Metricool SEO",
      data: response.data,
    });
  } catch (error) {
    res.status(500).json({
      platform: "SEO / Web Analytics",
      error: error.message,
      details: error.response?.data || "Error desconocido",
    });
  }
});

// === 📊 DASHBOARD COMPLETO ===
app.get("/api/dashboard", async (req, res) => {
  try {
    const [meta, google, tiktok, linkedin, youtube, seo] =
      await Promise.allSettled([
        getMetrics(
          "https://app.metricool.com/api/stats/aggregations/fbAdsPerformance"
        ),
        getMetrics(
          "https://app.metricool.com/api/stats/aggregations/googleAdsPerformance"
        ),
        getMetrics(
          "https://app.metricool.com/api/stats/aggregations/tiktokAdsPerformance"
        ),
        getMetrics(
          "https://app.metricool.com/api/stats/aggregations/linkedinAdsPerformance"
        ),
        getMetrics(
          "https://app.metricool.com/api/stats/aggregations/youtubeAdsPerformance"
        ),
        axios
          .get("https://app.metricool.com/api/stats/aggregations/webAnalytics", {
            params: {
              start: "20251001",
              end: "20251101",
              timezone: "Europe/Madrid",
              userId: process.env.USER_ID,
              blogId: process.env.BLOG_ID,
            },
            headers: { "X-Mc-Auth": process.env.METRICOOL_TOKEN },
          })
          .then((r) => r.data)
          .catch(() => null),
      ]);

    res.json({
      success: true,
      fecha: new Date().toISOString(),
      resumen: {
        meta: meta.value || { error: "sin acceso" },
        google: google.value || { error: "sin acceso" },
        tiktok: tiktok.value || { error: "sin acceso" },
        linkedin: linkedin.value || { error: "sin acceso" },
        youtube: youtube.value || { error: "sin acceso" },
        seo:
          seo.value ||
          "⚠️ Esperando activación del módulo SEO por parte de Metricool",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error generando dashboard",
      error: error.message,
    });
  }
});

// === 🚀 SERVIDOR ===
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`)
);
