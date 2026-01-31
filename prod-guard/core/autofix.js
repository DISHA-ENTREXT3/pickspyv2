export function applyAutofix(failures) {
  failures.forEach(f => {
    if (f.autofix && f.fix) {
      f.fix();
      console.log(`🔧 Auto-fixed: ${f.name}`);
    }
  });
}
