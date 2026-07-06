import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'

interface Props {
  header?: null | string
  links?: NonNullable<Footer['navGroup1']>['links']
}

export function FooterNavColumn({ header, links }: Props) {
  if (!links?.length) return null

  return (
    <div>
      {header ? <h3 className="mb-4 font-medium text-white/60 uppercase tracking-[1.2px]">{header}</h3> : null}
      <nav>
        <ul className="flex flex-col gap-2">
          {links.map((item) => {
            return (
              <li key={item.id}>
                <CMSLink appearance="link" {...item.link} className='text-white/40 hover:text-white' />
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
