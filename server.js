import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ Estado API
app.get("/", (req, res) => {
  res.send("✅ Idexia Metricool API activa y lista para recibir datos e insights.");
});

// 🧠 Helper: obtener métricas de una plataforma
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

// === ENDPOINTS INDIVIDUALES ===
const endpoints = {
  meta: "fbAdsPerformance",
  google: "googleAdsPerformance",
  tiktok: "tiktokAdsPerformance",
  linkedin: "linkedinAdsPerformance",
  youtube: "youtubeAdsPerformance",
};

// Genera endpoints individuales /api/meta, /api/google, etc.
Object.entries(endpoints).forEach(([name, path]) => {
  app.get(`/api/${name}`, async (req, res) => {
    try {
      const data = await getMetrics(`https://app.metricool.com/api/stats/aggregations/${path}`);
      res.json(data);
    } catch (error) {
      res.status(500).json({
        platform: name,
        error: error.message,
        details: error.response?.data || "Error desconocido",
      });
    }
  });
});

// === SEO ===
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

    res.json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({
      platform: "SEO / Web Analytics",
      error: error.message,
      details: error.response?.data || "Error desconocido",
    });
  }
});

// === 📊 DASHBOARD COMPLETO CON INTELIGENCIA ===
app.get("/api/dashboard", async (req, res) => {
  try {
    // 1️⃣ Recolectar datos
    const [meta, google, tiktok, linkedin, youtube, seo] = await Promise.allSettled([
      getMetrics(`https://app.metricool.com/api/stats/aggregations/fbAdsPerformance`),
      getMetrics(`https://app.metricool.com/api/stats/aggregations/googleAdsPerformance`),
      getMetrics(`https://app.metricool.com/api/stats/aggregations/tiktokAdsPerformance`),
      getMetrics(`https://app.metricool.com/api/stats/aggregations/linkedinAdsPerformance`),
      getMetrics(`https://app.metricool.com/api/stats/aggregations/youtubeAdsPerformance`),
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

    // 2️⃣ Normalizar resultados
    const ads = {
      meta: meta.value || { error: "sin acceso" },
      google: google.value || { error: "sin acceso" },
      tiktok: tiktok.value || { error: "sin acceso" },
      linkedin: linkedin.value || { error: "sin acceso" },
      youtube: youtube.value || { error: "sin acceso" },
    };

    const seoData =
      seo.value ||
      "⚠️ Esperando activación del módulo SEO por parte de Metricool";

    // 3️⃣ Calcular promedios globales
    const validPlatforms = Object.values(ads).filter((p) => !p.error);
    const avg = (field) =>
      validPlatforms.length
        ? (
            validPlatforms.reduce((sum, p) => sum + (p[field] || 0), 0) /
            validPlatforms.length
          ).toFixed(2)
        : null;

    const global = {
      avgCPM: avg("cpm"),
      avgCPC: avg("cpc"),
      avgCTR: avg("ctr"),
      plataformasActivas: validPlatforms.length,
    };

    // 4️⃣ Generar insights automáticos
    const insights = [];

    // Meta Ads
    if (ads.meta.cpm && ads.meta.ctr > 1) {
      insights.push("Meta Ads muestra un coste por mil (CPM) muy eficiente y un CTR saludable. Mantener inversión.");
    }

    // Google Ads
    if (ads.google.error) {
      insights.push("Google Ads aún no conectado. Conectar GA4 para mejorar captación activa.");
    }

    // SEO
    if (typeof seoData === "string") {
      insights.push("El módulo SEO de Metricool no está activo todavía. Actívalo para integrar analítica web (visitas, tráfico orgánico).");
    } else {
      insights.push("Analítica SEO disponible. Revisa páginas vistas y visitantes para ajustar estrategia de contenido.");
    }

    // Recomendación general
    if (global.avgCPM && global.avgCPM < 5) {
      insights.push("El coste medio de publicidad es competitivo. Posible oportunidad para escalar campañas.");
    } else {
      insights.push("El CPM medio es alto. Revisar segmentación y creatividad.");
    }

    // 5️⃣ Responder al cliente o GPT
    res.json({
      success: true,
      fecha: new Date().toISOString(),
      resumen: {
        plataformas: ads,
        seo: seoData,
        global,
        insights,
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
