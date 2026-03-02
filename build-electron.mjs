import esbuild from 'esbuild'
import path from 'path'
import { fileURLToPath } from 'url'

await esbuild.build({
  entryPoints: ['electron/main.ts', 'electron/preload.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outdir: 'dist-electron',
  format: 'cjs',
  external: ['electron', 'node-pty'],
  sourcemap: true,
  outExtension: { '.js': '.cjs' }
})

console.log('Electron build complete')
