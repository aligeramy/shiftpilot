import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn", // Allow any types as warnings for now
      "@typescript-eslint/no-unused-vars": "warn",  // Allow unused vars as warnings
      "react-hooks/exhaustive-deps": "warn",        // Allow missing deps as warnings
    }
  }
];

export default eslintConfig;
