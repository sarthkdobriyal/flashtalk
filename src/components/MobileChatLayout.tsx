'use client'
import { FC, Fragment, useEffect, useState } from 'react'
import { Transition, Dialog } from '@headlessui/react'
import { Menu, X } from 'lucide-react'
import Button from './ui/Button'     
import Logo from './ui/Logo'     
import Link from 'next/link'
import { Icon, Icons } from '@/components/Icons'
import SignOutButton from '@/components/SignOutButton'
import SidebarChatList from '@/components/SidebarChatList'
import FriendRequestSidebarOption from '@/components/FriendRequestSidebarOption'
import Image from 'next/image'
import { SidebarOption } from '../types/typings'
import { usePathname } from 'next/navigation'

interface MobileChatLayoutProps {
  friends: User[]
  session: Session
  sidebarOptions: SidebarOption[]
  unseenRequestCount: number
}


const MobileChatLayout: FC<MobileChatLayoutProps> = ({friends, session, sidebarOptions, unseenRequestCount}) => {

  const [open, setOpen] = useState<boolean>(false)

  const pathname = usePathname()

  useEffect(() => setOpen(false),[pathname])

  return <div className='fixed bg-bgcolor border-b border-zinc-500 top-0 inset-x-0 py-2 px-4'>
    <div className='w-full  flex justify-between items-center'>
        <Link
          href='/dashboard'
          className='flex h-8 shrink-0 items-center'>
          <Logo />
        </Link>
        <Button onClick={() => setOpen(true)} className='gap-4 bg-transparent hover:bg-slate-400' >
           <Menu className='h-6 w-6 text-pink-700' />
        </Button>
      </div>

      <Transition.Root show={open} as={Fragment}>
  <Dialog as="div" className="relative z-10" onClose={setOpen}>
    <Transition.Child
      as={Fragment}
      enter="ease-in-out duration-500"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in-out duration-500"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
    </Transition.Child>

    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-in-out duration-500 sm:duration-700"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-500 sm:duration-700"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-500"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute right-0 top-0  flex pr-2 pt-4 -mr-18 sm:pr-4">
                  <button
                    type="button"
                    className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close panel</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex h-full flex-col overflow-y-auto bg-bgcolor py-6 shadow-xl">
                <div className="px-4 sm:px-6">
                  <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                    Dashboard
                  </Dialog.Title>
                </div>
                <div className="relative mt-6 flex-1 px-4 sm:px-6">{/* Your content */}

                {
            friends.length > 0 && (
                <div className="text-xl font-semibold leading-6 text-pink-900 font-baloo ">
                    Your Chats -
                </div>
            )
        }

<nav className="flex flex-1 flex-col h-full">
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
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </div>
  </Dialog>
</Transition.Root>

  </div>
}

export default MobileChatLayout