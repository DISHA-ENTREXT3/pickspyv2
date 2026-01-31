import cors from "../checks/cors.js";
import rateLimit from "../checks/rateLimit.js";
import network from "../checks/network.js";
import load from "../checks/load.js";
import security from "../checks/security.js";

const checks = [cors, rateLimit, network, load, security];

export async function runChecks(policy) {
  const failed = [];

  for (const check of checks) {
    const res = await check.run(policy);
    if (!res.ok) failed.push(res);
  }

  return { failed };
}
