"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function TooltipProvider({ children }: { delay?: number; children: React.ReactNode }) {
  return <>{children}</>
}

interface TooltipContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const TooltipContext = React.createContext<TooltipContextType>({
  open: false,
  setOpen: () => {},
})

function Tooltip({ children, ...props }: { children: React.ReactNode; open?: boolean; defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(props.defaultOpen ?? false)
  const isOpen = props.open ?? open

  return (
    <TooltipContext.Provider value={{ open: isOpen, setOpen }}>
      {children}
    </TooltipContext.Provider>
  )
}

function TooltipTrigger({
  children,
  render,
  ...props
}: React.ComponentProps<"button"> & { render?: React.ReactElement }) {
  const { setOpen } = React.useContext(TooltipContext)

  const eventHandlers = {
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false),
  }

  if (render) {
    return React.cloneElement(
      render,
      { ...eventHandlers, "data-slot": "tooltip-trigger", ...props } as Record<string, unknown>,
      children ?? (render.props as Record<string, unknown>).children as React.ReactNode
    )
  }

  return (
    <button data-slot="tooltip-trigger" {...eventHandlers} {...props}>
      {children}
    </button>
  )
}

function TooltipContent({
  className,
  side = "top",
  children,
  hidden,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "top" | "bottom" | "left" | "right"
  sideOffset?: number
  align?: "start" | "center" | "end"
  alignOffset?: number
}) {
  const { open } = React.useContext(TooltipContext)

  if (!open || hidden) return null

  return (
    <div
      data-slot="tooltip-content"
      data-side={side}
      role="tooltip"
      className={cn(
        "z-50 inline-flex w-fit max-w-xs items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background animate-in fade-in-0 zoom-in-95",
        side === "top" && "slide-in-from-bottom-2",
        side === "bottom" && "slide-in-from-top-2",
        side === "left" && "slide-in-from-right-2",
        side === "right" && "slide-in-from-left-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
