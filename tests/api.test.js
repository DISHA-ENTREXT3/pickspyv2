import fetch from "node-fetch";

const BASE = process.env.BASE_URL;

if (!BASE) {
  console.log("⚠️  BASE_URL not set, skipping API test");
  process.exit(0);
}

try {
  const r = await fetch(`${BASE}/health`);
  if (r.status !== 200) throw new Error("Health failed");
  console.log("✅ API Health test passed");
} catch (err) {
  console.error("❌ API Health test failed:", err.message);
  process.exit(1);
}
