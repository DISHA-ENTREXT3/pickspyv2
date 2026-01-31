import fs from "fs";

export default {
  name: "Load",
  async run(policy) {
    if (!fs.existsSync("load-test-result.json")) return { ok: true };
    const r = JSON.parse(fs.readFileSync("load-test-result.json"));
    if (r.p95LatencyMs > policy.load.p95_latency_ms) {
      return { ok: false, name: "Load", severity: "CRITICAL" };
    }
    return { ok: true };
  }
};
