import React, { useEffect, useImperativeHandle, useState } from "react"

import Eye from "@modules/common/icons/eye"
import EyeOff from "@modules/common/icons/eye-off"

type InputProps = Omit<
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
  "placeholder"
> & {
  label: string
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
  name: string
  topLabel?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { type, name, label, touched: _touched, required, topLabel, ...props },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [inputType, setInputType] = useState(type)

    useEffect(() => {
      if (type === "password" && showPassword) {
        setInputType("text")
      }

      if (type === "password" && !showPassword) {
        setInputType("password")
      }
    }, [type, showPassword])

    useImperativeHandle(ref, () => inputRef.current!)

    return (
      <div className="flex w-full flex-col">
        {topLabel && (
          <label className="mb-2 text-[10px] uppercase tracking-[3px] text-[#77746d]">
            {topLabel}
          </label>
        )}
        <div className="relative z-0 flex w-full text-sm">
          <input
            type={inputType}
            name={name}
            placeholder=" "
            required={required}
            className="peer mt-0 block h-12 w-full appearance-none border border-[#d8d4cc] bg-white px-4 pb-1 pt-5 text-sm text-[#24231f] transition focus:border-[#292821] focus:outline-none focus:ring-0"
            {...props}
            ref={inputRef}
          />
          <label
            htmlFor={name}
            onClick={() => inputRef.current?.focus()}
            className="pointer-events-none absolute left-3 top-3.5 origin-left px-1 text-[#77746d] transition-all duration-200 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:scale-75"
          >
            {label}
            {required && <span className="text-[#a18d72]">*</span>}
          </label>
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-3.5 px-4 text-[#77746d] outline-none transition-all duration-150 hover:text-[#24231f] focus:text-[#24231f] focus:outline-none"
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          )}
        </div>
      </div>
    )
  }
)

Input.displayName = "Input"

export default Input
