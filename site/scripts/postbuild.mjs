#!/usr/bin/env node
/**
 * Roda depois do `next build`:
 *  - copia public/.htaccess para out/.htaccess (o Next não copia arquivos que começam com ponto);
 *  - confere que o export tem o essencial (index, 404, rotas).
 */
import { copyFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'out')

if (!existsSync(out)) {
  console.error('postbuild: out/ não existe (o build falhou ou output:"export" saiu do next.config.ts).')
  process.exit(1)
}
const ht = join(root, 'public', '.htaccess')
if (existsSync(ht)) {
  copyFileSync(ht, join(out, '.htaccess'))
  console.log('postbuild: .htaccess copiado para out/')
}
const must = ['index.html', '404.html', 'v1/index.html', 'v2/index.html', 'v3/index.html']
const missing = must.filter((f) => !existsSync(join(out, f)))
if (missing.length) {
  console.error('postbuild: faltam no export:', missing.join(', '))
  process.exit(1)
}
console.log('postbuild: export ok (' + must.length + ' arquivos essenciais)')
