'use client'
import { Check, Cross, UserPlus, X } from 'lucide-react'
import Image from 'next/image'
import { FC, useState } from 'react'

interface FriendRequestsProps {
    IncomingFriendRequests: IncomingFriendRequest[],
    sessionId: number,
}

const FriendRequests: FC<FriendRequestsProps> = ({
    IncomingFriendRequests,
    sessionId
}) => {

    const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
        IncomingFriendRequests
    )

    



  return <>
    {
        friendRequests === 0 ? (
            <p className='text-accent text-base'>You have no friend requests</p>
        ): (
            friendRequests.map((request) => (
                <div key={request.senderId} className='flex gap-4 items-center  p-2 hover:shadow-lg rounded-lg'>
                    {
                        request.senderImage ? (
                            <div className='relative h-8 w-8 bg-transparent rouneded-full'>
                            <Image
                                fill
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
                    <button aria-label='deny friend' className='w-8 h-8 bg-primary hover:bg-cyan-600 grid place-items-center rounded-full transition hover:shadow-md '><Check className='font-semibold text-gray-400 w-3/4 h-3/4'/></button>
                    <button aria-label='accept friend' className='w-8 h-8 bg-red-500 hover:bg-red-900 grid place-items-center rounded-full transition hover:shadow-md '><X className='font-semibold text-gray-400   w-3/4 h-3/4' /></button>
                </div>
            ))
        )
    }
  </>
}

export default FriendRequests