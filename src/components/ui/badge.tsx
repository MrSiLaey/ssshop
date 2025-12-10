'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default:
          'bg-primary/10 text-primary border border-primary/20',
        secondary:
          'bg-muted text-muted-foreground border border-border',
        success:
          'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20',
        warning:
          'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20',
        destructive:
          'bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20',
        info:
          'bg-primary/10 text-primary border border-primary/20',
        outline:
          'text-primary border border-primary/50',
        gold:
          'bg-gradient-to-r from-yellow-500/20 to-primary/20 text-primary border border-primary/30 shadow-sm shadow-primary/20',
        luxury:
          'bg-background text-primary border border-primary/30 shadow-lg shadow-primary/10',
        white:
          'bg-foreground/10 text-foreground border border-foreground/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
