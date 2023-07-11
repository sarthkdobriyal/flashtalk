import { FC } from 'react'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { fetchRedis} from '@/helper/redis'
import FriendRequests from '@/components/FriendRequests'


const page: FC= async () => {


    const session = await getServerSession(authOptions)
    if(!session) notFound()

    
    const incomingSenderIds = await fetchRedis('smembers', `user:${session.user.id}:incoming_friend_requests` ) as string[]

    const incomingFriendRequests = await Promise.all(
      incomingSenderIds.map(async (senderId) => {
        const sender = (await fetchRedis('get', `user:${senderId}`)) as User
        return {
          senderId,
          senderName: JSON.parse(sender).name,
          senderEmail: JSON.parse(sender).email,
          senderImage: JSON.parse(sender).image,
        }
      } )
      )
      
      
  return <main className='pt-8 m-2'>
  <h1 className='font-bold  font-baloo text-6xl text-pink-900 mb-20 '>Friend Requests</h1>
  <div className="flex flex-col gap-4">
      <FriendRequests IncomingFriendRequests={incomingFriendRequests} sessionId={session.user.id} />
  </div>
  
</main>
}

export default page