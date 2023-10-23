"use client"

import { useState } from "react"
import classNames from "clsx"

import { Link } from "@/components/Link"
import { FormState } from "@/components/FormState"

export interface InputProps extends React.ComponentPropsWithRef<"input"> {
  name: string
  label: string
  error?: string | null
  showForgotPassword?: boolean
  className?: string
}

export const getInputType = (inputType: string): string => {
  return inputType === "password" ? "text" : "password"
}

export const Input: React.FC<InputProps> = (props) => {
  const {
    label,
    name,
    placeholder,
    className,
    type = "text",
    showForgotPassword = false,
    error,
    ...rest
  } = props
  const [inputType, setInputType] = useState(type)

  const handlePassword = (): void => {
    const oppositeType = getInputType(inputType)
    setInputType(oppositeType)
  }

  return (
    <div className="flex flex-col">
      <div className={classNames("mb-2 mt-6 flex justify-between", className)}>
        <label className="pl-1" htmlFor={name}>
          {label}
        </label>
        {type === "password" && showForgotPassword ? (
          <Link
            href="/authentication/forgot-password"
            className="text-xs sm:text-sm"
          >
            Mot de passe oublié ?
          </Link>
        ) : null}
      </div>
      <div className="relative mt-0">
        <input
          data-cy={`input-${name}`}
          className="h-11 w-full rounded-lg border border-transparent bg-[#3D3B39] px-3 leading-10 text-white focus:border-2 focus:border-[#898987] focus:outline-none"
          {...rest}
          id={name}
          name={name}
          placeholder={placeholder ?? label}
          type={inputType}
        />
        {type === "password" ? (
          <div
            data-cy="password-eye"
            onClick={handlePassword}
            style={{
              backgroundImage: `url('/icons/input/${inputType}.svg')`,
            }}
            className="absolute right-4 top-3 z-10 h-5 w-5 cursor-pointer bg-cover"
          />
        ) : null}
        <FormState
          id={`error-${name ?? "input"}`}
          state={error == null ? "idle" : "error"}
          message={error}
        />
      </div>
    </div>
  )
}
