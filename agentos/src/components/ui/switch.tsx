"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Switch({
  className,
  size = "default",
  checked,
  onCheckedChange,
  defaultChecked,
  disabled,
  ...props
}: React.ComponentProps<"button"> & {
  size?: "sm" | "default"
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  defaultChecked?: boolean
}) {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked ?? false)
  const isControlled = checked !== undefined
  const isChecked = isControlled ? checked : internalChecked

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      data-slot="switch"
      data-size={size}
      data-state={isChecked ? "checked" : "unchecked"}
      disabled={disabled}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=default]:h-[18.4px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px] dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        isChecked ? "bg-primary" : "bg-input dark:bg-input/80",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={() => {
        const next = !isChecked
        if (!isControlled) setInternalChecked(next)
        onCheckedChange?.(next)
      }}
      {...props}
    >
      <span
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full bg-background ring-0 transition-transform",
          size === "default" ? "size-4" : "size-3",
          isChecked
            ? "translate-x-[calc(100%-2px)] dark:bg-primary-foreground"
            : "translate-x-0 dark:bg-foreground"
        )}
      />
    </button>
  )
}

export { Switch }
