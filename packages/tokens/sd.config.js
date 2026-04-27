import StyleDictionary from "style-dictionary";

const sd = new StyleDictionary({
  source: ["src/tokens.json"],
  platforms: {
    css: {
      transformGroup: "css",
      prefix: "cl",
      buildPath: "dist/",
      files: [
        {
          destination: "tokens.css",
          format: "css/variables",
          options: {
            selector: ":root",
            outputReferences: false,
            showFileHeader: true,
          },
        },
      ],
    },
    json: {
      transformGroup: "js",
      prefix: "cl",
      buildPath: "dist/",
      files: [
        {
          destination: "tokens.json",
          format: "json/nested",
          options: {
            showFileHeader: false,
          },
        },
      ],
    },
    js: {
      transformGroup: "js",
      prefix: "cl",
      buildPath: "dist/",
      files: [
        {
          destination: "tokens.js",
          format: "javascript/es6",
          options: {
            showFileHeader: false,
          },
        },
        {
          destination: "tokens.d.ts",
          format: "typescript/es6-declarations",
          options: {
            showFileHeader: false,
          },
        },
      ],
    },
  },
});

await sd.cleanAllPlatforms();
await sd.buildAllPlatforms();

console.log("\n✅ @cl/tokens build complete");
console.log("   dist/tokens.css  — CSS custom properties (:root)");
console.log("   dist/tokens.json — Flat token map (for MCP server)");
console.log("   dist/tokens.js   — ES6 named exports");
console.log("   dist/tokens.d.ts — TypeScript declarations\n");
