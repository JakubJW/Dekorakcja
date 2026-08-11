'use client'

import { Cart } from '@/components/Cart'
import { OpenCartButton } from '@/components/Cart/OpenCart'
import { CMSLink } from '@/components/Link'
import type { Header } from '@/payload-types'
import { cn } from '@/utilities/cn'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Suspense } from 'react'
import { AccountButton } from './AccountButton'
import { MobileMenu } from './MobileMenu'

type Props = {
  header: Header
}

export function HeaderClient({ header }: Props) {
  const menu = header.navItems || []
  const pathname = usePathname()

  return (
    <div className="relative z-20 border-b">
      <nav className="flex py-2 container">
        <div className="block flex-none md:hidden">
          <Suspense fallback={null}>
            <MobileMenu menu={menu} />
          </Suspense>
        </div>
        <Link
          className="flex w-full items-center justify-center md:w-auto font-serif text-xl text-primary"
          href="/"
        >
          Dekorakcja
        </Link>
        {menu.length ? (
          <ul className="hidden gap-4 text-sm md:flex md:items-center mx-auto">
            {menu.map((item) => (
              <li key={item.id}>
                <CMSLink
                  {...item.link}
                  size={'clear'}
                  className={cn('relative font-sans text-sm pb-5 uppercase tracking-[1.4px]', {
                    active:
                      item.link.url && item.link.url !== '/'
                        ? pathname.includes(item.link.url)
                        : false,
                  })}
                />
              </li>
            ))}
          </ul>
        ) : null}
        <AccountButton />
        <Suspense fallback={<OpenCartButton />}>
          <Cart />
        </Suspense>
      </nav>
    </div>
  )
}
