'use client'

import { cn } from '@/utilities/cn'
import { ChevronDown } from 'lucide-react'
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type RefObject,
  type SetStateAction,
} from 'react'

interface CollapsibleContext {
  isCollapsed: boolean
  setIsCollapsed: Dispatch<SetStateAction<boolean>>
  height: number | undefined
  collapsibleContentRef: RefObject<HTMLDivElement | null>
}

const CollapsibleContext = createContext<CollapsibleContext | null>(null)

const useCollapsibleContext = () => {
  const context = useContext(CollapsibleContext)

  if (!context) {
    console.error('Faq components must be used within FaqItem provider!')
    throw new Error('Faq components must be used within FaqItem provider!')
  }

  return context
}

export function Collapsible({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [height, setHeight] = useState<number>()
  const collapsibleContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const measureHeight = () => {
      if (collapsibleContentRef.current) {
        setHeight(collapsibleContentRef.current.scrollHeight)
      }
    }
    measureHeight()

    window.addEventListener('resize', measureHeight)

    return () => {
      window.removeEventListener('resize', measureHeight)
    }
  }, [])

  return (
    <CollapsibleContext.Provider
      value={{ isCollapsed, setIsCollapsed, height, collapsibleContentRef }}
    >
      <div className="border-b py-4 overflow-hidden">{children}</div>
    </CollapsibleContext.Provider>
  )
}

export function CollapsibleTrigger({ children }: { children: ReactNode }) {
  const { isCollapsed, setIsCollapsed } = useCollapsibleContext()

  return (
    <div
      className="py-2 flex items-center gap-4 cursor-pointer"
      onClick={() => setIsCollapsed((prevIsCollapsed) => !prevIsCollapsed)}
    >
      {/* <BadgeHelp className="text-primaryFg" /> */}
      {children}
      <ChevronDown
        className={cn(!isCollapsed && 'rotate-180', 'size-4 text-primaryFg duration-300 ml-auto')}
      />
    </div>
  )
}

export function CollapsibleContent({ children }: { children: ReactNode }) {
  const { collapsibleContentRef, isCollapsed, height } = useCollapsibleContext()

  return (
    <div
      ref={collapsibleContentRef}
      style={{
        maxHeight: isCollapsed ? 0 : `${height}px`,
        transitionProperty: 'max-height',
        transitionDuration: '0.3s',
      }}
    >
      <div className="py-4">{children}</div>
    </div>
  )
}
