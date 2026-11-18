import { useCustomCart } from '@/features/cart/use-cart'
import clsx from 'clsx'
import { XIcon } from 'lucide-react'
import React from 'react'

export function DeleteItemButton({
  removeItemHandler,
}: {
  removeItemHandler: () => Promise<void>
}) {
  const { isLoading, removeItem } = useCustomCart()

  return (
    <form>
      <button
        aria-label="Remove cart item"
        className={clsx(
          'ease hover:cursor-pointer flex size-4 items-center justify-center rounded-full bg-neutral-500 transition-all duration-200',
          {
            'cursor-not-allowed px-0': isLoading,
          },
        )}
        disabled={isLoading}
        onClick={async (e: React.FormEvent<HTMLButtonElement>) => {
          e.preventDefault()
          await removeItemHandler()
        }}
        type="button"
      >
        <XIcon className="hover:text-accent-3 mx-px h-4 w-4 text-white" />
      </button>
    </form>
  )
}
