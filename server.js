import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000; // 🔹 Cambiado para Render

// Ruta principal para comprobar que la API está activa
app.get("/", (req, res) => {
  res.send("✅ Idexia Metricool API activa y lista para recibir datos.");
});

// Ejemplo de endpoint para Meta Ads (con tu configuración Metricool)
app.get("/api/meta", async (req, res) => {
  try {
    const response = await axios.get(
      "https://app.metricool.com/api/stats/aggregations/fbAdsPerformance",
      {
        params: {
          start: "20251001",
          end: "20251101",
          timezone: "Europe/Madrid",
          userId: process.env.USER_ID,
          blogId: process.env.BLOG_ID,
        },
        headers: {
          "X-Mc-Auth": process.env.METRICOOL_TOKEN,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.data || "Error desconocido",
    });
  }
});

// 🔹 Importante: escuchar en 0.0.0.0 para Render
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
});
