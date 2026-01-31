import fs from "fs";

export default {
  name: "Security",
  async run(policy) {
    if (!fs.existsSync("zap-report.json")) return { ok: true };
    const r = JSON.parse(fs.readFileSync("zap-report.json"));
    if (r.alerts?.some(a => policy.security.block_on.includes(a.risk))) {
      return { ok: false, name: "Security", severity: "CRITICAL" };
    }
    return { ok: true };
  }
};
