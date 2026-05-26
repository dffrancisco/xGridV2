const esbuild = require('esbuild')
const fs = require('fs')
const path = require('path')

const watch = process.argv.includes('--watch')
const root = path.join(__dirname, '..')
const distDir = path.join(root, 'xGridV2')

const buildOptions = {
  entryPoints: [path.join(root, 'index.ts')],
  bundle: true,
  format: 'iife',
  globalName: 'xGridV2',
  outfile: path.join(distDir, 'xGridV2.js'),
  target: 'es2018',
  sourcemap: true,
  footer: {
    js: 'if (xGridV2 && xGridV2.default) { xGridV2 = xGridV2.default; }',
  },
}

function copyAssets() {
  fs.mkdirSync(distDir, { recursive: true })
  fs.copyFileSync(path.join(root, 'index.css'), path.join(distDir, 'xGridV2.css'))
  fs.copyFileSync(path.join(root, 'index.d.ts'), path.join(distDir, 'index.d.ts'))
}

async function run() {
  copyAssets()

  if (watch) {
    const ctx = await esbuild.context(buildOptions)
    await ctx.watch()
    console.log('xGridV2: watch em xGridV2/xGridV2.js')
    return
  }

  await esbuild.build(buildOptions)
  console.log('xGridV2: build concluído → xGridV2/xGridV2.js, xGridV2/xGridV2.css, xGridV2/index.d.ts')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
