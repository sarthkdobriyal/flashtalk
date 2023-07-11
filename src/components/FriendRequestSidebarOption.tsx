'use client'
import { FC, useState } from 'react'
import Link from 'next/link'
import { User } from 'lucide-react'
 
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