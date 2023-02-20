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

export const userSettingsSchemaObject = Type.Object(userSettingsSchema)

export type Language = Static<typeof userSettingsSchema.language>

export type UserSettings = Static<typeof userSettingsSchemaObject>

export const userSettingsExample: UserSettings = {
  id: 1,
  language: 'fr',
  userId: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}
