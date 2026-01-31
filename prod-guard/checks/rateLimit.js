import fs from "fs";

export default {
  name: "Rate Limit",
  async run(policy) {
    const cfg = JSON.parse(fs.readFileSync("rate-limit.config.json"));
    if (cfg.requestsPerMinute > policy.rate_limit.requests_per_minute.max) {
      return {
        ok: false,
        name: "Rate Limit",
        severity: "CRITICAL",
        autofix: true,
        fix() {
          cfg.requestsPerMinute = policy.rate_limit.requests_per_minute.max;
          fs.writeFileSync("rate-limit.config.json", JSON.stringify(cfg, null, 2));
        }
      };
    }
    return { ok: true };
  }
};
