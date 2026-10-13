#!/usr/bin/env node
/**
 * Verificação completa: build -> servidor estático em porta livre -> check_pagina.py em v1, v2 e v3 -> peso.
 *
 *   npm run check                     build + verificador nas 3 rotas
 *   npm run check -- --no-build       reaproveita o out/ existente
 *   npm run check -- --routes v1,v2  outras rotas
 *
 * Saída: .check/<rota>/ (390.png, 768.png, 1024.png, 1440.png, *-dobra.png, *-modal.png, _folha.jpg,
 * _relatorio.json) + .check/size.json. Código de saída 1 se houver ERRO (avisos não reprovam).
 * Variável CHECK_PAGINA aponta para outro check_pagina.py.
 */
import { spawn, spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { startServer } from './serve-out.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

/** Roda um processo SEM travar o loop de eventos (o servidor estático vive neste mesmo processo). */
function run(cmd, args, options = {}) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, options)
    let stdout = ''
    let stderr = ''
    child.stdout?.on('data', (d) => (stdout += d))
    child.stderr?.on('data', (d) => (stderr += d))
    child.on('close', (status) => resolve({ status, stdout, stderr }))
    child.on('error', (e) => resolve({ status: 1, stdout, stderr: String(e) }))
  })
}
const args = process.argv.slice(2)
const flag = (n) => args.includes(`--${n}`)
const opt = (n, d) => {
  const i = args.indexOf(`--${n}`)
  return i >= 0 ? args[i + 1] : d
}
const CHECK = process.env.CHECK_PAGINA ?? 'C:\\Users\\User\\design\\skills\\direcao-de-arte\\scripts\\check_pagina.py'
const routes = opt('routes', 'v1,v2,v3').split(',').map((s) => s.trim()).filter(Boolean)
const outDir = join(root, '.check')
mkdirSync(outDir, { recursive: true })

if (!flag('no-build')) {
  console.log('> npm run build')
  const b = spawnSync('npm', ['run', 'build'], { cwd: root, stdio: 'inherit', shell: true })
  if (b.status !== 0) {
    console.error('Build falhou.')
    process.exit(1)
  }
}
if (!existsSync(join(root, 'out', 'index.html'))) {
  console.error('out/ não existe.')
  process.exit(1)
}
if (!existsSync(CHECK)) {
  console.error(`check_pagina.py não encontrado em ${CHECK} (defina CHECK_PAGINA).`)
  process.exit(1)
}

const { url, close, port } = await startServer({ dir: join(root, 'out'), port: 0 })
console.log(`\nservidor estático em ${url} (porta ${port})`)

const summary = []
let failed = false
for (const r of routes) {
  const target = `${url}/${r}/`
  const dest = join(outDir, r)
  mkdirSync(dest, { recursive: true })
  console.log(`\n=== ${r}  ${target}`)
  const p = await run('python', [CHECK, target, '-o', dest], { env: { ...process.env, PYTHONIOENCODING: 'utf-8' } })
  process.stdout.write(p.stdout ?? '')
  if (p.stderr) process.stderr.write(p.stderr)
  let rel = null
  try {
    rel = JSON.parse(readFileSync(join(dest, '_relatorio.json'), 'utf8'))
  } catch {
    /* sem relatório */
  }
  const erros = rel?.erros?.length ?? (p.status === 0 ? 0 : 1)
  const avisos = rel?.avisos?.length ?? 0
  if (erros > 0 || p.status !== 0) failed = true
  summary.push({ rota: r, erros, avisos, saida: p.status })
}
await close()

console.log('\n=== peso por rota')
const size = spawnSync('node', [join(root, 'scripts', 'size.mjs')], { cwd: root, stdio: 'inherit' }) // servidor já fechado
if (size.status !== 0) failed = true

writeFileSync(join(outDir, 'resumo.json'), JSON.stringify({ summary, sizeOk: size.status === 0 }, null, 2))
console.log('\n=== resumo')
for (const s of summary) console.log(`${s.rota.padEnd(6)} erros=${s.erros} avisos=${s.avisos}`)
console.log(`peso: ${size.status === 0 ? 'dentro do orçamento' : 'ACIMA do orçamento'}`)
process.exit(failed ? 1 : 0)
