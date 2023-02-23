import type { Static } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'

import { userSchema } from './User.js'
import { date, id } from './utils.js'

export const locales = [Type.Literal('fr-FR')]

export const userSettingsSchema = {
  id,
  locale: Type.Union(locales),
  createdAt: date.createdAt,
  updatedAt: date.updatedAt,
  userId: userSchema.id
}

export const userSettingsSchemaObject = Type.Object(userSettingsSchema)

/**
 * ISO 639-1 (Language codes) - ISO 3166-1 (Country Codes)
 * @see https://www.iso.org/iso-639-language-codes.html
 * @see https://www.iso.org/iso-3166-country-codes.html
 * @example 'fr-FR'
 * @example 'en-US'
 */
export type Locale = Static<typeof userSettingsSchema.locale>

export type UserSettings = Static<typeof userSettingsSchemaObject>
