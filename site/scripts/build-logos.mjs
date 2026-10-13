#!/usr/bin/env node
/**
 * Converte os SVG de assets-src/logos/ em:
 *   - public/logos/*.svg        (otimizados, cor ouro; para <img>, favicon, OG)
 *   - lib/logos.generated.ts    (viewBox + miolo do SVG, para o componente <Logo> inline com currentColor)
 *
 * Otimizações seguras: remove ids/data-name/<defs> vazios, arredonda números para 2 casas
 * (viewBox ~1600 unidades: erro < 0,005), tira o fill fixo (#CDA85E) para o <Logo> controlar a cor.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'assets-src', 'logos')
const outPublic = join(root, 'public', 'logos')
mkdirSync(outPublic, { recursive: true })

const round = (s) => s.replace(/-?\d+\.\d{3,}/g, (n) => String(Number(Number(n).toFixed(2))))

function clean(svg) {
  let t = svg
    .replace(/<\?xml[^>]*\?>/g, '')
    .replace(/<defs>\s*<\/defs>/g, '')
    .replace(/\s(id|data-name)="[^"]*"/g, '')
    .replace(/\s+/g, ' ')
    .replace(/> </g, '><')
    .trim()
  return round(t)
}

const files = readdirSync(src).filter((f) => f.endsWith('.svg')).sort()
const table = {}
for (const f of files) {
  const raw = readFileSync(join(src, f), 'utf8')
  const t = clean(raw)
  const vb = t.match(/viewBox="([^"]+)"/)[1]
  const [, , w, h] = vb.split(/\s+/).map(Number)
  const inner = t.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '').replace(/\sfill="#CDA85E"/gi, '')
  // arquivo para <img>/favicon: mantém o ouro explícito
  const standalone = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" fill="#CDA85E">${inner}</svg>`
  writeFileSync(join(outPublic, f), standalone)
  const key = basename(f, '.svg') // ex.: a-tarja-todos-pta-aovivo
  table[key] = { viewBox: vb, w, h, inner }
  console.log(`${f.padEnd(36)} ${(raw.length / 1024).toFixed(1)} KB -> ${(standalone.length / 1024).toFixed(1)} KB`)
}

const header = `// ARQUIVO GERADO por scripts/build-logos.mjs — não editar à mão.\n// Fonte: assets-src/logos/*.svg (conceitos A·Tarja e C·REC, versão "todos" = ouro).\n`
const body = `export const LOGOS = ${JSON.stringify(table, null, 1)} as const\nexport type LogoKey = keyof typeof LOGOS\n`
writeFileSync(join(root, 'lib', 'logos.generated.ts'), header + body)
console.log(`\nlib/logos.generated.ts  ${(Buffer.byteLength(header + body) / 1024).toFixed(1)} KB`)
