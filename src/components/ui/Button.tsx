import { ButtonHTMLAttributes, FC } from 'react'
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import Loader2 from 'lucide-react'
import {cn} from  '@/lib/utils'


const buttonVariants = cva(
    'active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-baloo font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-700 focus:ring-primary disabled:opacity-50 disabled:pointer-events-none',
    {
        variants: {
            variant: {
                default: 'bg-secondary text-white hover:bg-pink-700 ',
                ghost: 'bg-transparent text-slate-900 hover:bg-slate-700 hover:text-slate-400',
            },
            size: {
                default: 'h-10 py-2 px-4',
                sm: 'h-9 px-2',
                lg: 'h-11 px-8'
            }
        },
        defaultVariants: {
            variant: 'default',
            size: 'default'
        }
    },
)

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    isLoading?: boolean

}

const Button: FC<ButtonProps> = ({className, children, variant, isLoading, size, ...props}) => {
  return <button className={cn(buttonVariants({variant, size,className}))} disabled={isLoading}  {...props} >
    {
        isLoading ? <Loader2  className="mr-2 h-4 w-4 animate-spin"/> : null
    }
    {children}
  </button>
}

export default Button