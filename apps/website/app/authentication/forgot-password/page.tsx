"use client"

import { useMemo } from "react"
import { Form, useForm } from "react-component-form"
import type { HandleUseFormCallback } from "react-component-form"
import axios from "axios"
import { userSchema } from "@carolo/models"

import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { FormState } from "@/components/FormState"
import { errorsMessages, useFormTranslation } from "@/hooks/useFormTranslation"
import { api } from "@/lib/configurations"

const ForgotPasswordPage = (): JSX.Element => {
  const schema = useMemo(() => {
    return {
      email: userSchema.email,
    }
  }, [])

  const { handleUseForm, errors, fetchState, message } = useForm(schema)
  const { getFirstErrorTranslation } = useFormTranslation()

  const onSubmit: HandleUseFormCallback<typeof schema> = async (
    formData,
    formElement,
  ) => {
    try {
      const searchParams = new URLSearchParams()
      searchParams.set(
        "redirectURI",
        `${window.location.origin}/authentication/reset-password`,
      )
      await api.post(
        `/users/reset-password?${searchParams.toString()}`,
        formData,
      )
      formElement.reset()
      return {
        type: "success",
        message:
          "Demande de réinitialisation du mot de passe envoyé, veuillez vérifier vos emails!",
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        return {
          type: "error",
          message: errorsMessages["invalid-email"],
        }
      }
      return {
        type: "error",
        message: "interne du serveur.",
      }
    }
  }

  return (
    <div className="flex w-8/12 max-w-sm flex-col items-center justify-center sm:w-5/12">
      <Form className="w-full" noValidate onSubmit={handleUseForm(onSubmit)}>
        <Input
          type="email"
          name="email"
          label="Email"
          error={getFirstErrorTranslation(errors.email)}
        />

        <div className="mt-4">
          <Button type="submit" variant="purple" className="w-full">
            Envoyer
          </Button>
        </div>
      </Form>
      <FormState
        id="message"
        state={fetchState}
        message={message != null ? message : undefined}
      />
    </div>
  )
}

export default ForgotPasswordPage
