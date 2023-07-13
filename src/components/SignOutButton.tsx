'use client'
import { FC, useState,ButtonHTMLAttributes } from 'react'
import Button from './ui/Button'
import {signOut} from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { Loader2, LogOut } from 'lucide-react'

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>  {
  className?: string
}

const SignOutButton: FC<SignOutButtonProps> = ({...props}) => {

    const [isSigningOut, setIsSigningOut] = useState<boolean>(false)

  return <Button {...props} variant='ghost' onClick={ async () => {
    setIsSigningOut(true)
    try{
        await signOut()
    }catch(e) {
        toast.error('Error signing out')
    }finally{
        setIsSigningOut(false)
    }
  }}> 
    {
        isSigningOut ? <Loader2  className="mr-2 h-4 w-4 animate-spin"/> : (
            <LogOut className='w-6 h-6' />
        )
    }
  
  </Button>
}

export default SignOutButton