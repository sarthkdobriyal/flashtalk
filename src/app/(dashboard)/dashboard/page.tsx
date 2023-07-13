import { FC } from 'react'
import  {db}  from '../../../lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'



const page= async () => {

  const session = await getServerSession(authOptions)


  return (
    <div>
      dahsboard
    </div>
  )

}

export default page    