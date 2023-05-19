import { FC } from 'react'

interface LogoProps {
  
}

const Logo: FC<LogoProps> = ({}) => {
  return <h1 className="text-4xl md:text-6xl font-semibold font-freckleFace text-center text-secondary tracking-widest ">fl<span className='text-primary'>ash<span className='text-slate-700'>Talk.</span></span></h1>    
}

export default Logo