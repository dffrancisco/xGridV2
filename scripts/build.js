const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

const watch = process.argv.includes("--watch");
const root = path.join(__dirname, "..");
const distDir = path.join(root, "xGridV2");

const common = {
  entryPoints: [path.join(root, "index.ts")],
  bundle: true,
  target: "es2018",
  sourcemap: true,
};

// <script src="xGridV2.js">: expõe o global xGridV2
const iifeOptions = {
  ...common,
  format: "iife",
  globalName: "xGridV2",
  outfile: path.join(distDir, "xGridV2.js"),
  footer: {
    js: "if (xGridV2 && xGridV2.default) { xGridV2 = xGridV2.default; }",
  },
};

// import xGridV2 from "xgridv2": usado pelos projetos que instalam o pacote
const esmOptions = {
  ...common,
  format: "esm",
  outfile: path.join(distDir, "xGridV2.mjs"),
};

const allOptions = [iifeOptions, esmOptions];

function copyAssets() {
  fs.mkdirSync(distDir, { recursive: true });
  fs.mkdirSync(path.join(distDir, "examples"), { recursive: true });
  fs.copyFileSync(
    path.join(root, "index.css"),
    path.join(distDir, "index.css"),
  );
  fs.copyFileSync(
    path.join(root, "index.d.ts"),
    path.join(distDir, "index.d.ts"),
  );
  fs.copyFileSync(path.join(root, "index.ts"), path.join(distDir, "index.ts"));
  fs.copyFileSync(
    path.join(root, "examples/index.html"),
    path.join(distDir, "examples/index.html"),
  );
}

async function run() {
  copyAssets();

  if (watch) {
    for (const options of allOptions) {
      const ctx = await esbuild.context(options);
      await ctx.watch();
    }
    console.log("xGridV2: watch em xGridV2/xGridV2.js e xGridV2/xGridV2.mjs");
    return;
  }

  await Promise.all(allOptions.map((options) => esbuild.build(options)));
  console.log(
    "xGridV2: build concluído → xGridV2/xGridV2.js, xGridV2/xGridV2.mjs, xGridV2/index.css, xGridV2/index.d.ts",
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
