/**
 * Divide um título em LINHAS (as quebras que o navegador já fez, inclusive `text-wrap: balance`), sem biblioteca.
 *
 * Por que não SplitText: ele reconta as quebras depois de embrulhar as palavras e, com `text-wrap: balance`,
 * devolveu quebras diferentes das do desenho aprovado (3 linhas no lugar de 2 = salto de layout) e custa ~46 KB
 * gzip. Aqui medimos cada palavra com Range, agrupamos por `top` e reescrevemos o título como
 * <span.v2-ln-mask><span.v2-ln>linha</span></span> (cada linha em bloco, sem quebra própria): a altura e o
 * texto são IDÊNTICOS ao original; o movimento fica no CSS (transform com transição).
 *
 * a11y: o título ganha `aria-label` com o texto inteiro e as linhas ficam `aria-hidden`.
 * Reverter: a função devolvida restaura o HTML original (usada no resize e na desmontagem).
 */
export function splitLines(el: HTMLElement): () => void {
  const original = el.innerHTML
  const hadLabel = el.getAttribute('aria-label')
  const full = (el.textContent ?? '').replace(/\s+/g, ' ').trim()

  // 1) cada palavra, com o deslocamento dela em `textContent` (para preservar a pontuação e os espaços)
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  const words: { start: number; end: number; top: number }[] = []
  const range = document.createRange()
  let offset = 0
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const text = n.textContent ?? ''
    const re = /\S+/g
    for (let m = re.exec(text); m; m = re.exec(text)) {
      range.setStart(n, m.index)
      range.setEnd(n, m.index + m[0].length)
      const r = range.getClientRects()[0]
      if (r) words.push({ start: offset + m.index, end: offset + m.index + m[0].length, top: r.top })
    }
    offset += text.length
  }
  if (words.length === 0) return () => {}

  // 2) agrupa por linha (tolerância de meia altura de fonte)
  const raw = el.textContent ?? ''
  const tol = parseFloat(getComputedStyle(el).fontSize) * 0.5
  const lines: string[] = []
  let first = words[0]!
  let prev = words[0]!
  const flush = () => lines.push(raw.slice(first.start, prev.end).replace(/\s+/g, ' ').trim())
  for (const w of words.slice(1)) {
    if (w.top - prev.top > tol) {
      flush()
      first = w
    }
    prev = w
  }
  flush()
  if (lines.length === 0 || lines.join(' ').replace(/\s+/g, ' ') !== full) return () => {} // sanidade: não mexe se não bateu

  // 3) reescreve
  el.setAttribute('aria-label', full)
  el.textContent = ''
  lines.forEach((text, i) => {
    const mask = document.createElement('span')
    mask.className = 'v2-ln-mask'
    mask.setAttribute('aria-hidden', 'true')
    const line = document.createElement('span')
    line.className = 'v2-ln'
    line.style.setProperty('--l', String(i))
    line.textContent = text
    mask.appendChild(line)
    el.appendChild(mask)
  })
  el.classList.add('v2-split')

  return () => {
    el.innerHTML = original
    if (hadLabel === null) el.removeAttribute('aria-label')
    else el.setAttribute('aria-label', hadLabel)
    el.classList.remove('v2-split')
  }
}
