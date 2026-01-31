import fs from "fs";

export default {
  name: "Network",
  async run(policy) {
    const cfg = JSON.parse(fs.readFileSync("http-client.config.json"));
    if (cfg.timeoutMs < policy.network.timeout_ms.min) {
      return {
        ok: false,
        name: "Network",
        severity: "HIGH",
        autofix: true,
        fix() {
          cfg.timeoutMs = policy.network.timeout_ms.min;
          fs.writeFileSync("http-client.config.json", JSON.stringify(cfg, null, 2));
        }
      };
    }
    return { ok: true };
  }
};
