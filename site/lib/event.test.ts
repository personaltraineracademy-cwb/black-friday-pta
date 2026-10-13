import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  buildNights,
  formatClock,
  formatDay,
  formatElapsed,
  formatHour,
  formatNightLabel,
  getEventSnapshot,
  splitDuration,
} from './event.ts'

const nights = buildNights('2026-11-09T20:30:00-03:00')
const at = (iso: string) => getEventSnapshot(Date.parse(iso), nights)

test('3 noites, +1 dia cada, 2 h de duração', () => {
  assert.equal(nights.length, 3)
  assert.equal(nights[1]!.start - nights[0]!.start, 86_400_000)
  assert.equal(nights[0]!.end - nights[0]!.start, 7_200_000)
})

test('cinco estados', () => {
  assert.equal(at('2026-11-02T12:00:00-03:00').state, 'before')
  assert.equal(at('2026-11-09T10:00:00-03:00').state, 'today')
  assert.equal(at('2026-11-09T21:00:00-03:00').state, 'live')
  assert.equal(at('2026-11-09T23:00:00-03:00').state, 'between')
  assert.equal(at('2026-11-10T08:00:00-03:00').state, 'between')
  assert.equal(at('2026-11-10T21:00:00-03:00').state, 'live')
  assert.equal(at('2026-11-12T09:00:00-03:00').state, 'ended')
})

test('noite certa em cada estado', () => {
  assert.equal(at('2026-11-02T12:00:00-03:00').night?.n, 1)
  assert.equal(at('2026-11-09T23:00:00-03:00').night?.n, 2)
  assert.equal(at('2026-11-11T21:00:00-03:00').night?.n, 3)
  assert.equal(at('2026-11-12T09:00:00-03:00').night, null)
})

test('limites exatos: início conta como ao vivo, fim já é entre noites', () => {
  assert.equal(at('2026-11-09T20:30:00-03:00').state, 'live')
  assert.equal(at('2026-11-09T22:30:00-03:00').state, 'between')
  assert.equal(at('2026-11-11T22:30:00-03:00').state, 'ended')
})

test('isToday no dia da noite seguinte', () => {
  assert.equal(at('2026-11-10T08:00:00-03:00').isToday, true)
  assert.equal(at('2026-11-09T23:00:00-03:00').isToday, false)
})

test('às 23h do dia anterior ainda é "before" e nunca gera 00 dias no rótulo', () => {
  const s = at('2026-11-08T23:00:00-03:00')
  assert.equal(s.state, 'before')
  const p = splitDuration(s.msToStart!)
  assert.equal(p.d, 0)
  assert.equal(formatClock(p), '21:30:00')
})

test('formatação em horário de Brasília', () => {
  const t = nights[0]!.start
  assert.equal(formatDay(t), 'seg, 9/11')
  assert.equal(formatHour(t), '20h30')
  assert.equal(formatNightLabel(t), 'Seg 9/11')
  assert.equal(formatNightLabel(nights[1]!.start), 'Ter 10/11')
  assert.equal(formatNightLabel(nights[2]!.start), 'Qua 11/11')
  assert.equal(formatElapsed(3_725_000), '01:02:05')
})
