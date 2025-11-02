import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const apiClient = axios.create({
  baseURL: "https://app.metricool.com/api/v2/",
  headers: {
    Authorization: `Bearer ${process.env.METRICOOL_TOKEN}`,
    "Content-Type": "application/json"
  }
});

// Función genérica para GET con manejo de errores
export async function getData(endpoint, params = {}) {
  try {
    const response = await apiClient.get(endpoint, { params });
    return response.data;
  } catch (error) {
    console.error(`❌ Error en endpoint ${endpoint}:`, error.response?.status || error.message);
    return null;
  }
}
