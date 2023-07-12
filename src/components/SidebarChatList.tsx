'use client'
import { chatIdConstructor } from '@/lib/utils'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'

interface SidebarChatListProps {
    sessionId: string,
  friends: User[]
}

const SidebarChatList: FC<SidebarChatListProps> = ({sessionId, friends}) => {

    const [unseenMessages, setUnseenMessages] = useState<Message[]>([])


    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if(pathname.includes('chat')){
            setUnseenMessages((prev) => prev.filter((msg) => !pathname?.includes(msg.senderId)))
        }
    }, [pathname])


  return <ul role='list' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1 '>
    {
        friends.sort().map((friend) => {
            const unseenMessagesCount = unseenMessages.filter((msg) => msg.senderId === friend.id).length
            return <li key={friend.id} >
                
                <a href={`/dashboard/chat/${chatIdConstructor(sessionId,friend.id)}`}
                    className='text-gray-800 hover:bg-violet-900 hover:text-accent group flex items-center gap-x-3 rounded-md p-2 text-base leading-6 font-semibold'
                >
                    <div className='relative h-8 w-8 bg-transparent rounded-full'>
                            <Image
                                fill
                                referrerPolicy='no-referrer'
                                className='rounded-full'
                                src={friend.image || ''}
                                alt={friend.name}
                                />
                    </div>
                    {friend.name}
                    {unseenMessagesCount > 0 && (
                        <div className='rounded-full w-6 h-6 flex items-center justify-center text-accent bg-fuchsia-800'>
                            {unseenMessagesCount}
                        </div>
                    )}
                    </a>
            </li>
        })
    }
  </ul>
}

export default SidebarChatList