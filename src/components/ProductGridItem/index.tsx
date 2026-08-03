
import { Media } from '@/components/Media'
import { Price } from '@/components/Price'
import { PopulatedProduct } from '@/utilities/normalizeProduct'
import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'

type Props = {
  product: Partial<PopulatedProduct>
}

export const ProductGridItem: React.FC<Props> = ({ product }) => {
  const { gallery, priceInUSD, title } = product

  let price = priceInUSD

  const variants = product.variants

  if (variants && variants.length > 0) {
    const variant = variants[0]
    if (
      variant &&
      typeof variant === 'object' &&
      variant?.priceInUSD &&
      typeof variant.priceInUSD === 'number'
    ) {
      price = variant.priceInUSD
    }
  }

  const image =
    gallery?.[0]?.image && typeof gallery[0]?.image !== 'string' ? gallery[0]?.image : false

  return (
    <Link
      className="relative bg-white flex flex-col h-full w-full group shadow-xs hover:shadow-sm rounded-2xl overflow-hidden"
      href={`/products/${product.slug}`}
    >
      {image ? (
        <Media
          className={clsx('relative aspect-square object-cover overflow-hidden')}
          height={80}
          imgClassName={clsx('h-full w-full object-cover rounded-t-2xl', {
            'transition duration-300 ease-in-out group-hover:scale-102': true,
          })}
          resource={image}
          width={80}
        />
      ) : null}

      <div className="flex flex-col grow justify-between p-6">
        <div className="text-lg mb-2 text-primary line-clamp-2 text-ellipsis" title={title}>
          {title}
        </div>

        {typeof price === 'number' && <Price amount={price} className="text-secondary" />}
      </div>
    </Link>
  )
}
