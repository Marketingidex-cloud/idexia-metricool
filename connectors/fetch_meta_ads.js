import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const BASE_URL = "https://app.metricool.com/api/v2/metrics";

const headers = {
  Authorization: `Bearer ${process.env.METRICOOL_TOKEN}`,
  "Content-Type": "application/json"
};

async function fetchMetaAds() {
  try {
    const response = await axios.get(BASE_URL, {
      headers,
      params: {
        account_id: process.env.ACCOUNT_ID,
        userId: process.env.USER_ID,
        blogId: process.env.BLOG_ID,
        network: "facebookAds",
        start: "2025-10-01",
        end: "2025-11-01"
      }
    });

    console.log("✅ Datos Meta Ads desde API REST:");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("❌ Error Meta Ads REST:", error.response?.data || error.message);
  }
}

fetchMetaAds();
