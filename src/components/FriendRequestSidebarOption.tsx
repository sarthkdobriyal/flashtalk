'use client'
import { FC, useEffect, useState } from 'react'
import Link from 'next/link'
import { User } from 'lucide-react'
import { pusherClient } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
 
interface FriendRequestSidebarOptionProps {
    initialUnseenRequests: number,
    sessionId: string
}

const FriendRequestSidebarOption: FC<FriendRequestSidebarOptionProps> = ({
    initialUnseenRequests,
    sessionId
}) => {

    const [unseenRequests, setUnseenRequests] = useState<number>(
        initialUnseenRequests
    )

    const friendRequestHandler = () => {
        setUnseenRequests((prev) => prev+1)
    }
    const denyRequestHandler = () => {
        setUnseenRequests((prev) => prev-1)
    }
    
        useEffect(() => {
            pusherClient.subscribe(
                toPusherKey(`user:${sessionId}:incoming_friend_requests`)
            )
            pusherClient.subscribe(
                toPusherKey(`user:${sessionId}:deny_request`)
            )
            pusherClient.subscribe(toPusherKey(`user:${sessionId}:accept_request`))

            pusherClient.bind('incoming_friend_requests', friendRequestHandler )
            pusherClient.bind('deny_request', denyRequestHandler )
            pusherClient.bind('accept_request', denyRequestHandler )
            
            return () => {
                pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
                pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:deny_request`))
                pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:accept_request`))
                pusherClient.unbind('incoming_friend_requests', friendRequestHandler )
                pusherClient.unbind('deny_request', denyRequestHandler )
                pusherClient.unbind('accept_request', denyRequestHandler )
            }

        }, [])


  return <Link href='/dashboard/requests'
               className='text-gray-700 gap-x-4  hover:text-white font-baloo  hover:bg-gray-600  group flex items-center px-2 py-2 text-base font-medium rounded-md leading-6' 
  >

    <div className="text-accent border-gray-400 group-hover:border-indigo-600 group-hover:text-white flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-bgcolor">
        <User className='h-4 w-4' />
    </div>

    <p className='truncate'>Friend Requests</p>

    {
        unseenRequests > 0 ? (
            <div className='rounded-full w-6 h-6 flex items-center justify-center text-accent bg-fuchsia-800'>
                {unseenRequests}
            </div>
        ) : null
    }

  </Link>
}

export default FriendRequestSidebarOption