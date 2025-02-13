// eslint.config.js (or .ts if you're using TS for your config)
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import pluginQuery from "@tanstack/eslint-plugin-query";

export default tseslint.config(
	{ ignores: ["dist"] },
	{
		files: ["**/*.{ts,tsx}"], // Apply these rules to TS and TSX files
		languageOptions: {
			ecmaVersion: "latest", // Use "latest" instead of 2020
			sourceType: "module", // Ensure sourceType is set (important!)
			globals: {
				...globals.browser,
				...globals.es2021, // Include ES2021 globals for Promise.allSettled, etc.
			},
			parserOptions: {
				// Add parserOptions for TypeScript
				ecmaFeatures: {
					jsx: true,
				},
				project: true, // Use tsconfig.json for type-aware linting
			},
		},
		plugins: {
			"react-hooks": reactHooks,
			"react-refresh": reactRefresh,
			"@tanstack/query": pluginQuery, // Correct plugin name
		},
		extends: [
			js.configs.recommended,
			...tseslint.configs.strictTypeChecked, // More robust than recommended
			...tseslint.configs.stylisticTypeChecked, // Adds stylistic rules
			"plugin:react-hooks/recommended", // include the react-hooks plugin
		],
		rules: {
			// React Refresh rules (good practice to keep these)
			"react-refresh/only-export-components": [
				"warn",
				{ allowConstantExport: true },
			],
			// React Hooks rules (we get these from extends now)
			// ...reactHooks.configs.recommended.rules, // No longer needed

			// TanStack Query rules (apply recommended rules)
			...pluginQuery.configs["eslint-plugin"].rules,

			"@typescript-eslint/explicit-function-return-type": "off",
		},
	}
);
