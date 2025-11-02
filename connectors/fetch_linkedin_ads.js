import { getData } from "../utils/api_client.js";

export async function fetchLinkedinAds(start, end, userId, blogId) {
  console.log("📡 Cargando datos de LinkedIn Ads...");
  const endpoint = "ads/linkedin";
  const params = { start, end, userId, blogId };

  const data = await getData(endpoint, params);
  if (data) {
    console.log("✅ LinkedIn Ads OK");
    return data;
  } else {
    console.log("⚠️ LinkedIn Ads sin datos (esperando acceso API)");
    return null;
  }
}
