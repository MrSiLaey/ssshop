'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all duration-300',
  {
    variants: {
      variant: {
        default:
          'bg-purple-500/10 text-purple-400 border border-purple-500/20',
        secondary:
          'bg-muted text-muted-foreground border border-border',
        success:
          'bg-green-500/10 text-green-400 border border-green-500/20',
        warning:
          'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
        destructive:
          'bg-red-500/10 text-red-400 border border-red-500/20',
        info:
          'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
        outline:
          'text-purple-400 border border-purple-500/50',
        gold:
          'bg-linear-to-r from-yellow-500/20 to-amber-500/20 text-amber-400 border border-amber-500/30 shadow-sm shadow-amber-500/20',
        luxury:
          'bg-background text-purple-400 border border-purple-500/30 shadow-lg shadow-purple-500/10',
        white:
          'bg-foreground/10 text-foreground border border-foreground/20',
        'neon-purple':
          'bg-purple-500/10 text-purple-400 border border-purple-500/30 shadow-sm shadow-purple-500/20',
        'neon-cyan':
          'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/20',
        'neon-pink':
          'bg-pink-500/10 text-pink-400 border border-pink-500/30 shadow-sm shadow-pink-500/20',
        'neon-green':
          'bg-green-500/10 text-green-400 border border-green-500/30 shadow-sm shadow-green-500/20',
        'neon-orange':
          'bg-orange-500/10 text-orange-400 border border-orange-500/30 shadow-sm shadow-orange-500/20',
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
