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
          'bg-amber-500/10 text-amber-400 border border-amber-500/20',
        secondary:
          'bg-zinc-800 text-zinc-300 border border-zinc-700',
        success:
          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
        warning:
          'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
        destructive:
          'bg-red-500/10 text-red-400 border border-red-500/20',
        info:
          'bg-amber-500/10 text-amber-400 border border-amber-500/20',
        outline:
          'text-amber-200 border border-amber-500/50',
        gold:
          'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm shadow-amber-500/20',
        luxury:
          'bg-black text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/10',
        white:
          'bg-white/10 text-white border border-white/20',
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
