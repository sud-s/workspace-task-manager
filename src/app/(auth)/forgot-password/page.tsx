import { ForgotPasswordForm } from "./form"

export const metadata = {
  title: "Forgot Password",
}

export default function ForgotPasswordPage() {
  return (
    <>
      <h2 className="text-xl font-semibold text-zinc-100 mb-1">Reset password</h2>
      <p className="text-sm text-zinc-500 mb-6">
        Enter your email and we&apos;ll send you a reset link
      </p>
      <ForgotPasswordForm />
    </>
  )
}
