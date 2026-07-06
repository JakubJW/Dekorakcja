import type { Footer } from '@/payload-types'

import { FooterContactColumn } from '@/components/Footer/contact-column'
import { FooterNavColumn } from '@/components/Footer/nav-column'
import { LogoIcon } from '@/components/icons/logo'
import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import { Suspense } from 'react'

const { COMPANY_NAME, SITE_NAME } = process.env

function FooterColumnSkeleton() {
  const skeleton = 'w-full h-6 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700'

  return (
    <div className="flex flex-col gap-2">
      <div className={skeleton} />
      <div className={skeleton} />
      <div className={skeleton} />
      <div className={skeleton} />
    </div>
  )
}

export async function Footer() {
  const footer: Footer = await getCachedGlobal('footer', 1)()
  const { description, navGroup1, navGroup2, contactGroup } = footer
  const currentYear = new Date().getFullYear()

  const copyrightName = COMPANY_NAME || SITE_NAME || ''

  return (
    <footer className="text-sm bg-primary text-white/40 py-20">
      <div className="container">
        <div className="grid w-full grid-cols-1 gap-8 py-12 text-sm md:grid-cols-4 md:gap-12">
          <div className="flex flex-col gap-4">
            <Link className="flex items-center gap-2 text-black md:pt-1 dark:text-white" href="/">
              <LogoIcon className="w-6" />
              <span className="sr-only">{SITE_NAME}</span>
            </Link>
            {description ? <p className='whitespace-pre-wrap'>{description}</p> : null}
          </div>
          <Suspense fallback={<FooterColumnSkeleton />}>
            <FooterNavColumn header={navGroup1?.header} links={navGroup1?.links} />
          </Suspense>
          <Suspense fallback={<FooterColumnSkeleton />}>
            <FooterNavColumn header={navGroup2?.header} links={navGroup2?.links} />
          </Suspense>
          <Suspense fallback={<FooterColumnSkeleton />}>
            <FooterContactColumn header={contactGroup?.header} links={contactGroup?.links} />
          </Suspense>
        </div>
        <div className="border-t border-white/40 py-8 text-sm">
          <div className="container mx-auto flex w-full flex-col justify-center items-center gap-1 md:flex-row md:gap-0">
            <p className='uppercase text-xs tracking-[1px]'>
              &copy; {currentYear} {copyrightName}
              {copyrightName.length && !copyrightName.endsWith('.') ? '.' : ''} Wszystkie prawa zastrzeżone.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
