import { FC } from 'react'
import  {db}  from '../../lib/db'
interface pageProps {
  
}

const page: FC<pageProps> = async ({}) => {
    await db.set('test', 'test')
  return <div>page</div>
}

export default page    