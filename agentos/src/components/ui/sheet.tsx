"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

interface SheetContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const SheetContext = React.createContext<SheetContextType>({
  open: false,
  setOpen: () => {},
})

function Sheet({
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  children,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const open = controlledOpen ?? internalOpen
  const setOpen = React.useCallback(
    (v: boolean) => {
      if (controlledOpen === undefined) setInternalOpen(v)
      onOpenChange?.(v)
    },
    [controlledOpen, onOpenChange]
  )

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  )
}

function SheetTrigger({
  children,
  ...props
}: React.ComponentProps<"button">) {
  const { setOpen } = React.useContext(SheetContext)
  return (
    <button
      data-slot="sheet-trigger"
      onClick={() => setOpen(true)}
      {...props}
    >
      {children}
    </button>
  )
}

function SheetClose({
  children,
  ...props
}: React.ComponentProps<"button">) {
  const { setOpen } = React.useContext(SheetContext)
  return (
    <button
      data-slot="sheet-close"
      onClick={() => setOpen(false)}
      {...props}
    >
      {children}
    </button>
  )
}

function SheetOverlay({ className, ...props }: React.ComponentProps<"div">) {
  const { setOpen } = React.useContext(SheetContext)
  return (
    <div
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/10 animate-in fade-in-0 supports-backdrop-filter:backdrop-blur-xs",
        className
      )}
      onClick={() => setOpen(false)}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  dir,
  style,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "top" | "right" | "bottom" | "left"
  showCloseButton?: boolean
  dir?: string
  "data-sidebar"?: string
  "data-mobile"?: string
}) {
  const { open, setOpen } = React.useContext(SheetContext)

  if (!open) return null

  return (
    <>
      <SheetOverlay />
      <div
        data-slot="sheet-content"
        data-side={side}
        dir={dir}
        style={style}
        className={cn(
          "fixed z-50 flex flex-col gap-4 bg-background bg-clip-padding text-sm shadow-lg animate-in",
          side === "right" && "inset-y-0 right-0 h-full w-3/4 border-l slide-in-from-right sm:max-w-sm",
          side === "left" && "inset-y-0 left-0 h-full w-3/4 border-r slide-in-from-left sm:max-w-sm",
          side === "top" && "inset-x-0 top-0 h-auto border-b slide-in-from-top",
          side === "bottom" && "inset-x-0 bottom-0 h-auto border-t slide-in-from-bottom",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <Button
            variant="ghost"
            className="absolute top-3 right-3"
            size="icon-sm"
            onClick={() => setOpen(false)}
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </Button>
        )}
      </div>
    </>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-0.5 p-4", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="sheet-title"
      className={cn("text-base font-medium text-foreground", className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
