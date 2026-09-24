import * as React from "react"
import { TextField } from "@radix-ui/themes"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <TextField.Root
        size="2"
        className={className}
        type={type}
        ref={ref as any}
        {...(props as any)}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
