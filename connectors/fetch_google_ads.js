import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const headers = { "X-Mc-Auth": process.env.METRICOOL_TOKEN };
const baseParams = {
  account_id: process.env.ACCOUNT_ID,
  userId: process.env.USER_ID,
  blogId: process.env.BLOG_ID,
};

async function fetchGoogleAds() {
  try {
    const res = await axios.post(
      "https://app.metricool.com/api/v2/ads/google",
      { ...baseParams, start: "2025-10-01", end: "2025-10-31" },
      { headers }
    );
    console.log("✅ Datos Google Ads:");
    console.log(JSON.stringify(res.data, null, 2));
  } catch (error) {
    console.error("❌ Error Google Ads:", error.response?.data || error.message);
  }
}

fetchGoogleAds();
