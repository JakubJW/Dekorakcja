import { Media } from '@/payload-types'
import Image from 'next/image'

type Props = {
  children?: React.ReactNode
  image?: Media
}

export const CartItemImage = ({ image, children }: Props) => {
  return (
    <div className="relative size-20">
      {image?.url && (
        <Image
          alt={image?.alt}
          className="object-cover rounded-md border"
          src={image?.url}
          height={80}
          width={80}
        />
      )}
      <div className="absolute z-40 -top-2 -right-2">{children}</div>
    </div>
  )
}
