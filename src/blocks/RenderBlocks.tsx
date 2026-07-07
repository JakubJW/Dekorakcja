import { toKebabCase } from '@/utilities/toKebabCase'
import React, { Fragment } from 'react'
import type { Page } from '../payload-types'
import { blockComponents } from './index'

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = ({ blocks }) => {
  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (!hasBlocks) {
    return null
  }

  return (
    <Fragment>
      {blocks.map((block, index) => {
        const { blockName, blockType } = block

        if (blockType && blockType in blockComponents) {
          const Block = blockComponents[blockType]

          if (Block) {
            return (
              <div className="my-16" key={index}>
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore - weird type mismatch here */}
                <Block id={toKebabCase(blockName!)} {...block} />
              </div>
            )
          }
        }
        return null
      })}
    </Fragment>
  )
}
