import * as React from "react"
import { Button as RadixButton, IconButton } from "@radix-ui/themes"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'secondary' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm'
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild, ...props }, ref) => {
    let radixVariant: "solid" | "soft" | "outline" | "ghost" | "surface" = "solid"
    let color: "blue" | "red" | "gray" | undefined = undefined

    if (variant === 'destructive') {
      radixVariant = 'solid'
      color = 'red'
    } else if (variant === 'outline') {
      radixVariant = 'outline'
      color = 'gray'
    } else if (variant === 'ghost') {
      radixVariant = 'ghost'
      color = 'gray'
    } else if (variant === 'secondary') {
      radixVariant = 'soft'
      color = 'gray'
    } else if (variant === 'link') {
      radixVariant = 'ghost'
    }

    let radixSize: "1" | "2" | "3" | "4" = "2"
    if (size === 'sm' || size === 'icon-sm') radixSize = "1"
    if (size === 'lg') radixSize = "3"

    if (size === 'icon' || size === 'icon-sm') {
      return (
        <IconButton
          ref={ref}
          variant={radixVariant}
          color={color}
          size={radixSize}
          className={className}
          asChild={asChild}
          {...(props as any)}
        />
      )
    }

    return (
      <RadixButton
        ref={ref}
        variant={radixVariant}
        color={color}
        size={radixSize}
        className={className}
        asChild={asChild}
        {...(props as any)}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
