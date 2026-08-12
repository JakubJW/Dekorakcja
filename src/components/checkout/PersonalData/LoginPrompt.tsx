import Link from 'next/link'

export const LoginPrompt: React.FC = () => (
  <div className="w-full prose">
    <Link href="/login">Zaloguj się</Link>
    <span className="mx-2">lub</span>
    <Link href="/create-account">załóż konto</Link>
  </div>
)
