import type { Footer } from '@/payload-types'

interface Props {
  header?: null | string
  links?: NonNullable<Footer['contactGroup']>['links']
}

export function FooterContactColumn({ header, links }: Props) {
  if (!links?.length) return null

  return (
    <div>
      {header ? (
        <h3 className="mb-4 font-sans font-medium text-white/60 uppercase tracking-[1.2px]">
          {header}
        </h3>
      ) : null}
      <ul className="flex flex-col gap-2">
        {links.map((item) => {
          const href =
            item.contactType === 'phone'
              ? `tel:${item.value.replace(/[^+\d]/g, '')}`
              : `mailto:${item.value}`
          const display = item.label || item.value

          return (
            <li key={item.id}>
              <a className="text-white/40 hover:text-white" href={href}>
                {display}
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
