import { ResetPasswordForm } from "./form"

export const metadata = {
  title: "Set New Password",
}

export default function ResetPasswordPage() {
  return (
    <>
      <h2 className="text-xl font-semibold text-zinc-100 mb-1">Set new password</h2>
      <p className="text-sm text-zinc-500 mb-6">Choose a strong password for your account</p>
      <ResetPasswordForm />
    </>
  )
}
