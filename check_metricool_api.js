import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const BASE_URL = "https://app.metricool.com/api/v2/metrics";

const headers = {
  Authorization: `Bearer ${process.env.METRICOOL_TOKEN}`,
  "Content-Type": "application/json"
};

async function checkMetricoolAPI() {
  try {
    console.log("🔍 Verificando acceso a la API REST de Metricool...");

    const response = await axios.get(BASE_URL, {
      headers,
      params: { help: 1 }
    });

    console.log("✅ API disponible. Redes y métricas activas:");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("❌ Error 401: Token inválido o plan sin acceso a API REST.");
    } else if (error.response?.status === 403) {
      console.error("⚠️ Error 403: Acceso restringido. Puede que tu token no tenga permisos para algunos endpoints.");
    } else {
      console.error("❌ Error general:", error.response?.data || error.message);
    }
  }
}

checkMetricoolAPI();
