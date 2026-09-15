import { colors, radius, spacing } from "@hanjang/tokens";

const toKebab = (value: string) => value.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

const declarations = [
  ...Object.entries(colors).map(([key, value]) => `--color-${toKebab(key)}: ${value};`),
  ...Object.entries(spacing).map(([key, value]) => `--space-${key}: ${value}px;`),
  ...Object.entries(radius).map(([key, value]) => `--radius-${key}: ${value}px;`),
];

const TokenStyle = () => <style>{`:root {\n  ${declarations.join("\n  ")}\n}`}</style>;

export default TokenStyle;
