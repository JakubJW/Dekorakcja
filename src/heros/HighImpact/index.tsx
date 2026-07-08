'use client'
import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { cn } from '@/utilities/cn'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  return (
    <div className="relative -mt-16 flex items-center justify-center text-white">
      <div className="absolute w-full h-full bg-radial from-[#7A5642] to-primary opacity-80"></div>
      <div className="max-w-2xl mb-8 z-10 relative flex items-center justify-center">
        <div className="md:text-center">
          {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex md:justify-center gap-4">
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <CMSLink
                      {...link}
                      className={cn(
                        link.appearance === 'default' && 'bg-white text-primary',
                        link.appearance === 'outline' &&
                          'border border-white bg-transparent text-white',
                        'uppercase rounded-full font-semibold tracking-[1.4px] px-10 py-6 flex-1',
                      )}
                    />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
      <div className="min-h-[80vh] select-none bg-primary">
        {media && typeof media === 'object' && (
          <Media
            fill
            imgClassName="-z-10 object-cover"
            htmlElement={null}
            priority
            resource={media}
          />
        )}
      </div>
    </div>
  )
}
