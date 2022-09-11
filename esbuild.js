const esbuild = require("esbuild");
const copyStaticFiles = require('esbuild-copy-static-files');

esbuild
  .build({
    entryPoints: [
      // "./src/background.ts",
      "./src/content.ts",
      // "./src/popup.tsx",
      // "./src/injected.ts"
    ],
    bundle: true,
    minify: true,
    sourcemap: process.env.NODE_ENV !== "production",
    target: ["chrome80", "firefox78"],
    outdir: "./public/build",
    define: {
      "process.env.NODE_ENV": `"${process.env.NODE_ENV}"`
    },
    plugins: [copyStaticFiles({
      src: './src/styles.css',
      dest: './public/build/styles.css',
    })]
  })
  .catch(() => process.exit(1));