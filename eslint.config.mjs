import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["components/interior/**/*.tsx", "components/inspection/**/*.tsx", "components/international/**/*.tsx", "components/community-safety/**/*.tsx", "components/government/**/*.tsx", "components/social-support/**/*.tsx", "components/shared/**/*.tsx", "components/typing/**/*.tsx", "components/TeacherAudioMaker.tsx", "components/learning/**/*.tsx", "components/SiteSearch.tsx", "components/ComputerEngineeringLab.tsx", "components/TeacherToolkit.tsx", "components/KhmerOneBar.tsx"],
    rules: {
      // Native navigation preserves the verified workaround for Vinext Link transition failures.
      "@next/next/no-html-link-for-pages": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    files: ["components/ui/**/*.{ts,tsx}", "hooks/use-mobile.ts"],
    rules: {
      // These files are vendored verbatim from shadcn@4.17.0. Keep the
      // registry source intact while applying the stricter rules to Site code.
      "@typescript-eslint/no-unused-vars": "off",
      "react-hooks/purity": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
