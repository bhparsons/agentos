import * as React from "react"
import { cn } from "./utils"

type RenderProp = React.ReactElement | undefined

interface RenderSlotOptions {
  className?: string
  render?: RenderProp
  children?: React.ReactNode
  [key: string]: unknown
}

export function renderSlot(
  Tag: keyof React.JSX.IntrinsicElements,
  { render, className, children, ...props }: RenderSlotOptions
): React.ReactElement {
  if (render && React.isValidElement(render)) {
    return React.cloneElement(
      render,
      {
        ...props,
        className: cn(className, (render.props as Record<string, unknown>).className as string),
      } as Record<string, unknown>,
      children ?? (render.props as Record<string, unknown>).children as React.ReactNode
    )
  }

  return React.createElement(Tag, { className, ...props }, children)
}
