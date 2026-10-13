/**
 * Alerta (só no servidor/build; custo zero no navegador) quando as datas da copy ("Seg 9/11") não batem com
 * NEXT_PUBLIC_EVENT_START. Se a cliente mudar as datas, a copy e a variável precisam mudar juntas.
 */
import { config } from './config'
import { copy } from './copy'
import { buildNights, formatNightLabel } from './event'

export function warnIfCopyDatesDiffer(): void {
  const nights = buildNights(config.eventStart)
  copy.noites.cards.forEach((card, i) => {
    const night = nights[i]
    if (!night) return
    const expected = formatNightLabel(night.start)
    if (card.noite.replace(/\s+/g, ' ').trim().toLowerCase() !== expected.toLowerCase()) {
      console.warn(
        `[copy] noites.cards[${i}].noite = "${card.noite}" mas NEXT_PUBLIC_EVENT_START indica "${expected}". ` +
          'Atualize content/pagina-mae.copy.json e a variável juntos.',
      )
    }
  })
}
