import { FC } from 'react'
import AddFriendButton from '@/components/AddFriendButton'


const page: FC = ({}) => {
  return <main className='pt-8 m-2'>
    <h1 className='font-bold  font-bungeeInline text-6xl mb-6 text-pink-900 '>Add a friend</h1>
    <AddFriendButton />
  </main>
}

export default page