import fs from "fs";
import yaml from "js-yaml";

export function loadPolicy() {
  return yaml.load(fs.readFileSync("prod-guard.yml", "utf8"));
}
