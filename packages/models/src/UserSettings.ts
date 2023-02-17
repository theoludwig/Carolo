import type { Static } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'

import { date, id } from './utils.js'

export const languages = [Type.Literal('fr')]

export const userSettingsSchema = {
  id,
  language: Type.Union(languages),
  createdAt: date.createdAt,
  updatedAt: date.updatedAt,
  userId: id
}

export type Language = Static<typeof userSettingsSchema.language>

export const userSettingsExample = {
  id: 1,
  language: 'fr',
  userId: 1,
  createdAt: new Date(),
  updatedAt: new Date()
}
