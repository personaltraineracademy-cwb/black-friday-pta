/**
 * Rótulos de INTERFACE (neutros). Não são texto de venda: nada de promessa, preço, urgência ou nome de campanha.
 * Todo texto comercial vem de lib/copy.ts.
 */
export const UI = {
  skip: 'Pular para o conteúdo',
  close: 'Fechar',
  sending: 'Enviando…',
  retry: 'Tentar de novo',
  errorPrefix: 'Erro:',
  /** Erros de campo (linguagem simples, sem culpar). */
  errors: {
    nome: 'Digite seu nome.',
    whats: 'Digite o DDD e o número, por exemplo (11) 91234-5678.',
    email: 'Confira o e-mail.',
  },
  network: 'Sem conexão. Seus dados continuam aqui. Tente de novo.',
  groupAnyway: 'Entrar no grupo mesmo assim',
  pauseMotion: 'Pausar animação',
  resumeMotion: 'Retomar animação',
  freezeClock: 'Congelar',
  resumeClock: 'Retomar',
  clock: 'Relógio do evento',
  /** Estados do relógio. */
  clockStates: {
    beforeLabel: (n: number) => `Falta para a noite ${n}`,
    todayLabel: (n: number) => `Hoje · noite ${n}`,
    liveLabel: (n: number) => `Ao vivo agora · noite ${n}`,
    betweenLabel: (n: number) => `Próxima: noite ${n}`,
    endedLabel: 'Transmissão encerrada',
    startsAt: (when: string) => `Começa ${when} (horário de Brasília).`,
    startsTodayAt: (hhmm: string) => `É hoje. Começa às ${hhmm} (horário de Brasília).`,
    live: (n: number) => `A noite ${n} está no ar.`,
    ended: 'As três noites terminaram.',
    day: 'dia',
    days: 'dias',
    captionCountdown: 'H : M : S',
    captionLive: 'Tempo no ar',
  },
  night: 'Noite',
  placeholders: { nome: 'Seu nome', whats: '(11) 91234-5678', email: 'voce@exemplo.com' },
} as const
