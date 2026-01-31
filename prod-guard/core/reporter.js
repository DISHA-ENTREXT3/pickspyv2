export function report(result) {
  console.error("❌ PRODUCTION READINESS FAILED");
  result.failed.forEach(f => {
    console.error(`- ${f.name} (${f.severity})`);
  });
}
