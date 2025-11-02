import { getData } from "../utils/api_client.js";

export async function fetchYouTubeAds(start, end, userId, blogId) {
  console.log("📡 Cargando datos de YouTube Ads...");
  const endpoint = "ads/youtube";
  const params = { start, end, userId, blogId };

  const data = await getData(endpoint, params);
  if (data) {
    console.log("✅ YouTube Ads OK");
    return data;
  } else {
    console.log("⚠️ YouTube Ads sin datos (esperando acceso API)");
    return null;
  }
}
