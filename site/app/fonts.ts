/**
 * Fontes da marca, locais (nada de Google Fonts em tempo de execução), woff2 em subconjunto Latin/PT-BR.
 * Geradas por `npm run assets` a partir das TTF do estúdio (licença OFL em public/licencas/).
 *
 *   display  Big Shoulders 900            títulos curtos, numerais, tarjas
 *   text     Archivo 500–800 (variável)   corpo, botões, listas
 *   mono     Azeret Mono 500 e 600        rótulos, data, timecode
 *
 * next/font/local gera @font-face com `font-display: swap`, preload automático das fontes usadas pela rota
 * e uma fonte-reserva com métricas ajustadas (sem salto de layout na troca).
 */
import localFont from 'next/font/local'

export const display = localFont({
  src: './fonts/BigShoulders-900.woff2',
  weight: '900',
  style: 'normal',
  display: 'swap',
  variable: '--font-display-next',
  fallback: ['Arial Narrow', 'Impact', 'sans-serif'],
})

export const text = localFont({
  src: './fonts/Archivo-500-800.woff2',
  weight: '500 800',
  style: 'normal',
  display: 'swap',
  variable: '--font-text-next',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
})

export const mono = localFont({
  src: [
    { path: './fonts/AzeretMono-500.woff2', weight: '500', style: 'normal' },
    { path: './fonts/AzeretMono-600.woff2', weight: '600', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-mono-next',
  preload: false,
  fallback: ['ui-monospace', 'Consolas', 'monospace'],
})

/** Classes das 3 variáveis para o <html>. */
export const fontVariables = `${display.variable} ${text.variable} ${mono.variable}`
