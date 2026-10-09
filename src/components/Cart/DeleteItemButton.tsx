import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import clsx from 'clsx'
import { XIcon } from 'lucide-react'
import React from 'react'

export function DeleteItemButton({
  removeItemHandler,
}: {
  removeItemHandler: () => Promise<void>
}) {
  const { isLoading } = useCart()

  return (
    <form>
      <button
        aria-label="Usuń z koszyka"
        className={clsx(
          'ease hover:cursor-pointer flex p-1 items-center justify-center rounded-full border border-primary bg-[#F7F3EE]',
          {
            'cursor-not-allowed': isLoading,
          },
        )}
        disabled={isLoading}
        onClick={async (e: React.FormEvent<HTMLButtonElement>) => {
          e.preventDefault()
          await removeItemHandler()
        }}
        type="button"
      >
        <XIcon className="hover:text-accent-3 size-3 text-primary" />
      </button>
    </form>
  )
}
