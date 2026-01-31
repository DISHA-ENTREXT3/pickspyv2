import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULTS_PATH = path.join(__dirname, "../config/defaults.json");

export async function check(options = {}) {
  const config = JSON.parse(fs.readFileSync(DEFAULTS_PATH, 'utf-8'));
  const rateLimitPath = path.resolve(config.rateLimitConfig);
  
  if (!fs.existsSync(rateLimitPath)) {
    return {
      success: false,
      message: `Rate limit configuration file (${config.rateLimitConfig}) is missing.`
    };
  }

  const rateConfig = JSON.parse(fs.readFileSync(rateLimitPath, 'utf-8'));
  
  if (!rateConfig.requestsPerMinute || rateConfig.requestsPerMinute > 100) {
    return {
      success: false,
      message: "Rate limit threshold is too high or missing (max 100 RPM recommended)."
    };
  }

  return {
    success: true,
    message: "Rate limiting is configured correctly."
  };
}
