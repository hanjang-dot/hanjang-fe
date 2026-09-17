import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const SRC_ROOT = fileURLToPath(new URL("../src", import.meta.url));

export const readSource = (path: string): string =>
  readFileSync(new URL(`../src/${path}`, import.meta.url), "utf8");

const walk = (dir: string, prefix: string, out: string[]) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) walk(`${dir}/${entry.name}`, rel, out);
    else if (entry.name.endsWith(".tsx")) out.push(rel);
  }
  return out;
};

export const screenSources = (): { path: string; source: string }[] =>
  walk(SRC_ROOT, "", [])
    .filter((rel) => rel.startsWith("screens/") || rel.startsWith("app/"))
    .map((rel) => ({ path: rel, source: readSource(rel) }));
