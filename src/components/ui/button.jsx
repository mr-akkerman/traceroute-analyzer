import { cn } from "@/lib/utils"
import { forwardRef } from "react"
import PropTypes from 'prop-types'

const Button = forwardRef(({ className, ...props }, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Button.propTypes = {
  className: PropTypes.string
}

Button.displayName = "Button"

export { Button }