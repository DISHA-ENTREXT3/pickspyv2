import fs from "fs";

export default {
  name: "CORS",
  async run(policy) {
    const cfg = JSON.parse(fs.readFileSync("cors.config.json"));
    if (!policy.cors.allow_wildcard && cfg.allowOrigin === "*") {
      return {
        ok: false,
        name: "CORS",
        severity: "CRITICAL",
        autofix: true,
        fix() {
          cfg.allowOrigin = [];
          cfg.allowCredentials = false;
          fs.writeFileSync("cors.config.json", JSON.stringify(cfg, null, 2));
        }
      };
    }
    return { ok: true };
  }
};
