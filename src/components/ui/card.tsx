'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'neon' | 'neon-cyan' | 'neon-pink' | 'neon-green' | 'neon-orange' | 'gradient' | 'gold' | 'luxury'
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-card border-border',
      glass: 'bg-card/40 backdrop-blur-xl border-white/10 dark:border-white/5',
      neon: 'bg-card/50 backdrop-blur-xl border-purple-500/30 hover:border-purple-500/50 shadow-lg shadow-purple-500/5 hover:shadow-purple-500/20',
      'neon-cyan': 'bg-card/50 backdrop-blur-xl border-cyan-500/30 hover:border-cyan-500/50 shadow-lg shadow-cyan-500/5 hover:shadow-cyan-500/20',
      'neon-pink': 'bg-card/50 backdrop-blur-xl border-pink-500/30 hover:border-pink-500/50 shadow-lg shadow-pink-500/5 hover:shadow-pink-500/20',
      'neon-green': 'bg-card/50 backdrop-blur-xl border-green-500/30 hover:border-green-500/50 shadow-lg shadow-green-500/5 hover:shadow-green-500/20',
      'neon-orange': 'bg-card/50 backdrop-blur-xl border-orange-500/30 hover:border-orange-500/50 shadow-lg shadow-orange-500/5 hover:shadow-orange-500/20',
      gradient: 'bg-linear-to-br from-card via-muted to-card border-border',
      gold: 'bg-linear-to-br from-card via-card to-amber-500/10 border-amber-500/20 shadow-lg shadow-amber-500/5',
      luxury: 'bg-linear-to-br from-card via-background to-muted border-purple-500/20 shadow-xl shadow-purple-500/5 backdrop-blur-xl',
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
