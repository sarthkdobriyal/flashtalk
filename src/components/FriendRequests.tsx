'use client'
import { Check, Cross, UserPlus, X } from 'lucide-react'
import Image from 'next/image'
import { FC, useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { pusherClient } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'

interface FriendRequestsProps {
    IncomingFriendRequests: IncomingFriendRequest[],
    sessionId: number,
}

const FriendRequests: FC<FriendRequestsProps> = ({
    IncomingFriendRequests,
    sessionId
}) => {

    const router = useRouter();

    const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
        IncomingFriendRequests
    )

    const friendRequestHandler = ({senderId, senderEmail, senderImage, senderName}: IncomingFriendRequest) => {
        setFriendRequests((prev) => [...prev, {
            senderId: senderId,
            senderEmail: senderEmail,
            senderImage: senderImage ? senderImage : null,
            senderName: senderName
        } ])
    }
    
        useEffect(() => {
            pusherClient.subscribe(
                toPusherKey(`user:${sessionId}:incoming_friend_requests`)
            )

            pusherClient.bind('incoming_friend_requests', friendRequestHandler )

            return () => {
                pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
                pusherClient.unbind('incoming_friend_requests', friendRequestHandler )
            }

        }, [sessionId])

    const acceptFriend = async (senderId) => {
        await axios.post('/api/friends/accept', {id : senderId})

        setFriendRequests((prev) => prev.filter((req) => req.senderId !== senderId))

        router.refresh()

    }


    const denyFriend = async (senderId) => {
        await axios.post('/api/friends/deny', {id : senderId})

        setFriendRequests((prev) => prev.filter((req) => req.senderId !== senderId))

        router.refresh()

    }

    console.log(friendRequests)


  return <>
    {
        friendRequests.length === 0 ? (
            <p className='text-accent text-base'>You have no friend requests</p>
        ) : (
            friendRequests.map((request) => (
                <div key={request.senderId} className='flex gap-4 items-center  p-2 hover:shadow-lg rounded-lg'>
                    {
                        request.senderImage ? (
                            <div className='relative h-8 w-8 bg-transparent rouneded-full'>
                            <Image
                                fill
                                sizes='100%'
                                referrerPolicy='no-referrer'
                                className='rounded-full'
                                src={request.senderImage}
                                alt={request.senderName}
                            />
                        </div>
                        ) : (<UserPlus className='text-black'/>)
                    }
                    <div className='flex flex-col gap-1 leading-5 pl-3 pr-20' >
                    <p className='text-gray-300 font-baloo text-base'>{request.senderName}</p>
                    <p className='text-gray-400 font-baloo text-sm'>{request.senderEmail}</p>
                    </div>
                    <button onClick={() => acceptFriend(request.senderId)} aria-label='deny friend' className='w-8 h-8 bg-primary hover:bg-cyan-600 grid place-items-center rounded-full transition hover:shadow-md '><Check className='font-semibold text-gray-400 w-3/4 h-3/4'/></button>
                    <button onClick={() => denyFriend(request.senderId)} aria-label='accept friend' className='w-8 h-8 bg-red-500 hover:bg-red-900 grid place-items-center rounded-full transition hover:shadow-md '><X className='font-semibold text-gray-400   w-3/4 h-3/4' /></button>
                </div>
            ))
        )
    }
  </>
}

export default FriendRequests