"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { signup } from "@lib/data/customer"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)

  return (
    <div
      className="flex max-w-sm flex-col items-center text-[#24231f]"
      data-testid="register-page"
    >
      <p className="mb-3 text-[10px] tracking-[4px] text-[#a18d72]">DAFTAR</p>

      <h1 className="mb-4 text-center font-serif text-2xl font-light uppercase tracking-wide">
        Jadi Member VELORA
      </h1>

      <p className="mb-6 text-center text-sm leading-7 text-[#77746d]">
        Buat akunmu untuk belanja lebih cepat, menyimpan alamat, dan memantau
        pesananmu.
      </p>

      {message?.state === "verification_required" && (
        <div
          className="mb-4 w-full border border-[#e9e6df] bg-white p-4 text-center text-sm"
          data-testid="register-verification-message"
        >
          Kami mengirim tautan verifikasi ke <strong>{message.email}</strong>.
          Cek kotak masukmu untuk memverifikasi email, lalu masuk.
        </div>
      )}

      <form className="flex w-full flex-col" action={formAction}>
        <div className="flex w-full flex-col gap-y-2">
          <Input
            label="Nama depan"
            name="first_name"
            required
            autoComplete="given-name"
            data-testid="first-name-input"
          />

          <Input
            label="Nama belakang (opsional)"
            name="last_name"
            autoComplete="family-name"
            data-testid="last-name-input"
          />

          <Input
            label="Email"
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
          />

          <Input
            label="Nomor telepon"
            name="phone"
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
          />

          <Input
            label="Kata sandi"
            name="password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
          />
        </div>

        <ErrorMessage
          error={message?.state === "error" ? message.error : null}
          data-testid="register-error"
        />

        <span className="mt-6 text-center text-xs leading-6 text-[#77746d]">
          Dengan membuat akun, kamu menyetujui kebijakan privasi dan syarat
          penggunaan VELORA.
        </span>

        <SubmitButton className="mt-6 w-full" data-testid="register-button">
          Daftar
        </SubmitButton>
      </form>

      <span className="mt-6 text-center text-sm text-[#77746d]">
        Sudah punya akun?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="underline underline-offset-4 transition hover:text-[#a18d72]"
        >
          Masuk
        </button>
        .
      </span>
    </div>
  )
}

export default Register
