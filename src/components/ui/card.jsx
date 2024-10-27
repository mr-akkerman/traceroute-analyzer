import * as React from "react"
import { cn } from "@/lib/utils"
import PropTypes from 'prop-types'

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-xl border bg-card text-card-foreground shadow", className)}
    {...props}
  />
))

Card.propTypes = {
  className: PropTypes.string
}

Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))

CardHeader.propTypes = {
  className: PropTypes.string
}

CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))

CardTitle.propTypes = {
  className: PropTypes.string
}

CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))

CardContent.propTypes = {
  className: PropTypes.string
}

CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardContent }