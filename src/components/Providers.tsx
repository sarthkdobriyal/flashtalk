'use client'
import { FC, ReactNode } from 'react'
import { SessionProvider } from "next-auth/react"
import { Toaster } from 'react-hot-toast'

interface ProvidersProps {
  children: ReactNode
}

const Providers: FC<ProvidersProps> = ({session , children}) => {
  return (
    <SessionProvider>
        <Toaster position='top-center' reverseOrder={false} />
        {children}
    </SessionProvider>
  )
}

export default Providers