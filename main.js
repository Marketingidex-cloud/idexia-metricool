import { getData } from "./utils/api_client.js";

async function runAll() {
  console.log("🚀 Iniciando Idexia Marketing Intelligence - Módulo Metricool");

  const dateStart = "2025-10-01";
  const dateEnd = "2025-11-01";
  const userId = process.env.USER_ID;
  const blogId = process.env.BLOG_ID;

  const endpoints = {
    meta: "ads/facebook",
    google: "ads/google",
    tiktok: "ads/tiktok",
    linkedin: "ads/linkedin",
    youtube: "ads/youtube",
  };

  for (const [platform, endpoint] of Object.entries(endpoints)) {
    console.log(`\n📡 Cargando datos de ${platform.toUpperCase()}...`);
    const data = await getData(endpoint, { start: dateStart, end: dateEnd, userId, blogId });
    console.log(data ? `✅ ${platform} OK` : `⚠️ ${platform} sin datos (esperando acceso API)`);
  }

  console.log("\n✅ Idexia Marketing Intelligence preparado para recibir datos reales.");
}

runAll();
