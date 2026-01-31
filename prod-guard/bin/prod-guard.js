#!/usr/bin/env node
import { run } from "../core/runner.js";

const args = process.argv.slice(2);

run({
  ci: args.includes("--ci"),
  dry: args.includes("--dry")
});
