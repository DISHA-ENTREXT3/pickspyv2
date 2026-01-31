import { loadPolicy } from "./policy.js";
import { runChecks } from "./analyzer.js";
import { applyAutofix } from "./autofix.js";
import { report } from "./reporter.js";

export async function run(options) {
  const policy = loadPolicy();
  const result = await runChecks(policy);

  if (result.failed.length === 0) {
    console.log("✅ ALL CHECKS PASSED — SAFE TO DEPLOY");
    process.exit(0);
  }

  if (policy.gates.allow_autofix) {
    applyAutofix(result.failed);
  }

  report(result, policy);
  process.exit(1);
}
