import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function run(options = {}) {
  const { ci = false, dry = false, only = null } = options;
  const checksDir = path.join(__dirname, "../checks");
  
  console.log("🛡️  Starting Production Readiness Scan...");
  if (dry) console.log("🧪 Running in DRY mode (no fixes will be applied)");
  if (ci) console.log("🤖 Running in CI mode (errors will block)");

  const checkFiles = fs.readdirSync(checksDir).filter(f => f.endsWith(".js"));
  const checksToRun = only ? only.split(",") : null;

  let totalErrors = 0;

  for (const file of checkFiles) {
    const checkName = file.replace(".js", "");
    if (checksToRun && !checksToRun.includes(checkName)) continue;

    console.log(`\n🔍 Checking: ${checkName}...`);
    try {
      const { check } = await import(pathToFileURL(path.join(checksDir, file)).href);
      const result = await check(options);
      
      if (result.success) {
        console.log(`✅ ${checkName} passed!`);
      } else {
        console.error(`❌ ${checkName} failed: ${result.message}`);
        totalErrors++;
      }
    } catch (err) {
      console.error(`💥 Error running check ${checkName}:`, err.message);
      if (options.debug) console.error(err.stack);
      totalErrors++;
    }
  }

  console.log("\n-------------------------------------------");
  if (totalErrors === 0) {
    console.log("🎉 All checks passed! Ready for production.");
    process.exit(0);
  } else {
    console.error(`🚫 ${totalErrors} issue(s) found.`);
    if (ci) {
      console.error("⛔ Blocking deployment due to CI errors.");
      process.exit(1);
    }
    process.exit(0);
  }
}
