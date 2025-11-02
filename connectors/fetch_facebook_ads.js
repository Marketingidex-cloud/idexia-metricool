import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// Carga las credenciales desde el archivo .env
const headers = { "X-Mc-Auth": process.env.METRICOOL_TOKEN };
const baseParams = {
  account_id: process.env.ACCOUNT_ID,
  userId: process.env.USER_ID,
  blogId: process.env.BLOG_ID,
};

// Función que obtiene los datos de Metricool
async function fetchFacebookAds() {
  try {
    const res = await axios.post(
      "https://app.metricool.com/api/v2/ads/facebook",
      { ...baseParams, start: "2025-10-01", end: "2025-10-31" },
      { headers }
    );

    console.log("✅ Datos Facebook Ads:");
    console.log(res.data);

  } catch (error) {
    console.error("❌ Error al conectar con Metricool:", error.message);
  }
}

// Ejecuta la función
fetchFacebookAds();
