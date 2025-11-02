import { getData } from "../utils/api_client.js";

export async function fetchTikTokAds(start, end, userId, blogId) {
  console.log("📡 Cargando datos de TikTok Ads...");
  const endpoint = "ads/tiktok";
  const params = { start, end, userId, blogId };

  const data = await getData(endpoint, params);
  if (data) {
    console.log("✅ TikTok Ads OK");
    return data;
  } else {
    console.log("⚠️ TikTok Ads sin datos (esperando acceso API)");
    return null;
  }
}
