import classNames from "clsx"
import type { FetchState as FormStateType } from "react-component-form"

import { Loader } from "@/components/Loader/Loader"

export interface FormStateProps extends React.ComponentPropsWithoutRef<"div"> {
  state: FormStateType
  message?: string | null
  id?: string
}

export const FormState: React.FC<FormStateProps> = (props) => {
  const { state, message, id, ...rest } = props

  if (state === "loading") {
    return (
      <div data-cy="loader" className="mt-8 flex justify-center">
        <Loader />
      </div>
    )
  }

  if (state === "idle" || message == null) {
    return null
  }

  return (
    <div
      {...rest}
      className={classNames(
        props.className,
        "mt-4 flex max-w-xl items-center justify-center text-center font-medium",
        {
          "text-red-800 dark:text-red-400": state === "error",
          "text-green-800 dark:text-green-400": state === "success",
        },
      )}
    >
      <span id={id}>
        <b className="font-bold">{state === "error" ? "Erreur" : "Succès"}:</b>{" "}
        {message}
      </span>
    </div>
  )
}
