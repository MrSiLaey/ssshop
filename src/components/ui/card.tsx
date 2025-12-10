'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'neon' | 'gradient' | 'gold' | 'luxury'
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-card border-border',
      glass: 'bg-card/60 backdrop-blur-xl border-primary/10',
      neon: 'bg-card border-primary/30 shadow-lg shadow-primary/10',
      gradient: 'bg-gradient-to-br from-card via-muted to-card border-border',
      gold: 'bg-gradient-to-br from-card via-card to-primary/10 border-primary/20 shadow-lg shadow-primary/5',
      luxury: 'bg-gradient-to-br from-card via-background to-muted border-primary/20 shadow-xl shadow-primary/5 backdrop-blur-xl',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border transition-all duration-300',
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-xl font-semibold leading-none tracking-tight text-foreground',
      className
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
