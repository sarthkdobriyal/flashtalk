import { FC, ReactNode } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Logo from '@/components/ui/Logo'
import FriendRequestSidebarOption from '@/components/FriendRequestSidebarOption'
import SidebarChatList from '@/components/SidebarChatList'
import { Icon, Icons } from '../../../components/Icons'
import Image from 'next/image'
import SignOutButton from '@/components/SignOutButton'
import { fetchRedis } from '@/helper/redis'
import { getFriendsByUserId } from '@/helper/getFriends'


interface LayoutProps {
children: ReactNode
}

interface SidebarOption {
    id: number,
    name: string,
    href: string,
    Icon: Icon,

}

const sidebarOptions: SidebarOption[] = [
    {
        id: 1,
        name: 'Add Friend',
        href: '/dashboard/add',
        Icon: 'UserPlus'
    },
]


const Layout= async ({children}: LayoutProps) => {


    const session = await getServerSession(authOptions)
    if(!session) notFound()

    const friends = await getFriendsByUserId(session.user.id)


    const unseenRequestCount = ((await fetchRedis('smembers', `user:${session.user.id}:incoming_friend_requests`)) as User[]).length


  return <div className='w-full flex h-screen bg-bgcolor'>
    
    <div className="flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-500 p-2 px-4">

        <Link href='/dashboard' className='flex h-16 shrink-0 items-center'>
            <Logo />
        </Link>


        {
            friends.length > 0 && (
                <div className="text-xl font-semibold leading-6 text-pink-900 font-baloo ">
                    Your Chats -
                </div>
            )
        }

        

        <nav className="flex flex-1 flex-col">
            <ul role='list' className='flex flex-1 flex-col gap-y-7'>
                <li>
                    <SidebarChatList sessionId={session.user.id} friends={friends} />
                </li>
                <li>
                    <div className="text-xl font-semibold leading-6 text-pink-900 font-baloo ">Overview</div>
                    <ul role='list' className='-mx-2 mt-2 space-y-1'>
                        {
                            sidebarOptions.map((option) => {
                                
                                const Icon = Icons[option.Icon]
                                
                                return (
                                    <li key={option.id}>
                                        <Link href={option.href} className='text-slate-700 hover:text-white hover:bg-gray-600 group flex rounded-md p-2 gap-4 leading-6 text-base font-semibold '>
                                            <span className='text-accent border-gray-400 group-hover:border-indigo-500 group-hover:text-white h-6 w-6 flex shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium '>
                                                <Icon className='h-4 w-4' />
                                            </span>
                                            <span className='truncate'>
                                                {option.name}
                                            </span>
                                        </Link>
                                    </li>
                                )
                            })
                        }
                <li>
                    <FriendRequestSidebarOption 
                        sessionId={session.user.id}
                        initialUnseenRequests={unseenRequestCount}
                    />
                </li>
                    </ul>
                </li>



                <li className="mt-auto -mx-2 flex items-center justify-start gap-x-2">
                    <div className="flex flex-1 text-sm items-center gap-x-3  font-semibold leading-6 text-purple-900 ">
                        <div className='relative h-8 w-8 bg-bgcolor'>
                            <Image
                                fill
                                referrerPolicy='no-referrer'
                                className='rounded-full'
                                src={session.user.image || ''}
                                alt="Your dp" 
                            />
                        </div>
                        <span className='sr-only'>Your profile</span>
                        <div className="flex flex-col ">
                            <span aria-hidden='true' className='font-bold'>{session.user.name}</span>
                            <span aria-hidden='true' className="text-fuchsia-800 " >
                                {session.user.email}
                            </span>
                        </div>
                    </div>
                    
                    <SignOutButton className='h-full aspect-square' />
                    
                </li>
            </ul>
        </nav>

    </div>

    <aside className='container max-h-screen w-full'>
    {children}

    </aside>
    
    </div>
}

export default Layout