'use client'

import { Button } from '@/components/ui/button'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = {
  className?: string
}

export const AccountNav: React.FC<Props> = ({ className }) => {
  const pathname = usePathname()

  return (
    <div className={clsx(className)}>
      <ul className="flex flex-col gap-2">
        <li>
          <Button asChild variant="link">
            <Link
              href="/konto"
              className={clsx('text-primary/50 hover:text-primary hover:no-underline', {
                'text-primary': pathname === '/konto',
              })}
            >
              Ustawienia konta
            </Link>
          </Button>
        </li>

        <li>
          <Button asChild variant="link">
            <Link
              href="/konto/adresy"
              className={clsx('text-primary/50 hover:text-primary hover:no-underline', {
                'text-primary': pathname === '/konto/adresy',
              })}
            >
              Adresy
            </Link>
          </Button>
        </li>

        <li>
          <Button
            asChild
            variant="link"
            className={clsx('text-primary/50 hover:text-primary hover:no-underline', {
              'text-primary': pathname === '/zamowienia' || pathname.includes('/zamowienia'),
            })}
          >
            <Link href="/zamowienia">Zamówienia</Link>
          </Button>
        </li>
      </ul>

      <hr className="w-full border-white/5" />

      <Button
        asChild
        variant="link"
        className={clsx('text-primary/50 hover:text-primary hover:no-underline', {
          'text-primary': pathname === '/logout',
        })}
      >
        <Link href="/logout">Wyloguj się</Link>
      </Button>
    </div>
  )
}
