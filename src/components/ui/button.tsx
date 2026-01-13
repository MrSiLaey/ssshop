'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-lg hover:shadow-primary/20',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
        outline:
          'border border-input bg-background hover:bg-accent/10 hover:border-accent',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm',
        ghost:
          'hover:bg-accent/10 hover:text-accent',
        link:
          'text-primary underline-offset-4 hover:underline',
        neon:
          'bg-transparent border-2 border-primary text-primary hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/30 hover:border-primary/80',
        'neon-cyan':
          'bg-transparent border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-500/10 hover:shadow-lg hover:shadow-cyan-500/30',
        'neon-pink':
          'bg-transparent border-2 border-pink-500 text-pink-500 hover:bg-pink-500/10 hover:shadow-lg hover:shadow-pink-500/30',
        'neon-green':
          'bg-transparent border-2 border-green-500 text-green-500 hover:bg-green-500/10 hover:shadow-lg hover:shadow-green-500/30',
        'neon-fill':
          'bg-linear-to-r from-purple-600 via-purple-500 to-cyan-500 text-white font-semibold hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105',
        glow:
          'bg-linear-to-r from-purple-500 via-pink-500 to-cyan-500 text-white font-semibold hover:shadow-2xl hover:shadow-purple-500/50 animate-pulse-neon',
        gold:
          'bg-linear-to-r from-yellow-300 via-yellow-400 to-amber-500 text-black font-bold hover:from-yellow-200 hover:via-yellow-300 hover:to-amber-400 shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-12 rounded-lg px-8 text-base',
        xl: 'h-14 rounded-xl px-10 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="mr-2 h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            กำลังโหลด...
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
