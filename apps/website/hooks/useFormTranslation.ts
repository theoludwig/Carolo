import type { Error } from "react-component-form"

const knownErrorKeywords = ["minLength", "maxLength", "format"]

export const errorsMessages = {
  required: "Oups, ce champ est obligatoire 🙈.",
  minLength: "Le champ doit contenir au moins {expected} caractères.",
  maxLength: "Le champ doit contenir au plus {expected} caractères.",
  "invalid-email": "Mmm… Il semblerait que cet email ne soit pas valide 🤔.",
  invalid: "Valeur invalide.",
}

const getErrorTranslationKey = (error: Error): string => {
  if (knownErrorKeywords.includes(error?.keyword)) {
    if (
      error.keyword === "minLength" &&
      typeof error.data === "string" &&
      error.data.length === 0
    ) {
      return errorsMessages.required
    }
    if (error.keyword === "format") {
      if (error.params["format"] === "email") {
        return errorsMessages["invalid-email"]
      }
      return errorsMessages.invalid
    }
    return (
      errorsMessages[error.keyword as keyof typeof errorsMessages] ??
      errorsMessages.invalid
    )
  }
  return errorsMessages.invalid
}

export type GetErrorTranslation = (
  error: Error | undefined,
) => string | undefined

export type GetFirstErrorTranslation = (
  errors: Error[] | undefined,
) => string | undefined

export interface UseFormTranslationResult {
  getErrorTranslation: GetErrorTranslation
  getFirstErrorTranslation: GetFirstErrorTranslation
}

export const useFormTranslation = (): UseFormTranslationResult => {
  const getErrorTranslation = (
    error: Error | undefined,
  ): string | undefined => {
    if (error != null) {
      return getErrorTranslationKey(error).replace(
        "{expected}",
        error?.params?.["limit"],
      )
    }
    return undefined
  }

  const getFirstErrorTranslation = (
    errors: Error[] | undefined,
  ): string | undefined => {
    if (errors != null) {
      return getErrorTranslation(errors[0])
    }
    return undefined
  }

  return { getFirstErrorTranslation, getErrorTranslation }
}
