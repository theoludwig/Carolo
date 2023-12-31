import fs from "node:fs"
import { URL, fileURLToPath } from "node:url"

import ejs from "ejs"
import type { Locale } from "@carolo/models"

import {
  EMAIL_LOCALES_URL,
  EMAIL_TEMPLATE_URL,
} from "#src/tools/configurations.js"
import {
  emailTransporter,
  EMAIL_INFO,
} from "#src/tools/email/emailTransporter.js"

interface EmailTranslation {
  subject: string
  renderOptions: {
    subtitle: string
    button: string
    footer: string
  }
}

type EmailType = "confirm-email" | "reset-password"

interface SendEmailOptions {
  email: string
  type: EmailType
  url: string
  locale?: Locale
}

const getEmailTranslation = async (
  locale: Locale,
  type: EmailType,
): Promise<EmailTranslation> => {
  const filename = `${type}.json`
  let emailTranslationURL = new URL(
    `./${locale}/${filename}`,
    EMAIL_LOCALES_URL,
  )
  if (!fs.existsSync(emailTranslationURL)) {
    emailTranslationURL = new URL(`./fr/${filename}`, EMAIL_LOCALES_URL)
  }
  const translationString = await fs.promises.readFile(emailTranslationURL, {
    encoding: "utf-8",
  })
  return JSON.parse(translationString)
}

export const sendEmail = async (options: SendEmailOptions): Promise<void> => {
  const { email, type, url, locale = "fr-FR" } = options
  const emailTranslation = await getEmailTranslation(locale, type)
  const emailHTML = await ejs.renderFile(fileURLToPath(EMAIL_TEMPLATE_URL), {
    text: { ...emailTranslation.renderOptions, url },
  })
  await emailTransporter.sendMail({
    from: `"Carolo" <${EMAIL_INFO?.auth?.user as string}>`,
    to: email,
    subject: `Carolo - ${emailTranslation.subject}`,
    html: emailHTML,
  })
}
