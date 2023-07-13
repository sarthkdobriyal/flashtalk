import {  getServerSession } from 'next-auth'
import { authOptions} from '@/lib/auth'
import { FC } from 'react'
import { notFound } from 'next/navigation'
import { fetchRedis } from '@/helper/redis'
import { messageArrayValidator } from '../../../../../lib/validations/message'
import { db } from '@/lib/db'
import Image from 'next/image'
import Messages from '@/components/Messages'
import ChatInput from '@/components/ChatInput'


interface PageProps {
  params: {
    chatId: string
  }
}

async function getChatMessages(chatId: string) {
    try{
        const result: string[] = await fetchRedis('zrange', `chat:${chatId}:messages`,0,-1)

        const dbMessages = result.map((msg) => JSON.parse(msg) as Message)

        const reverseDbMessages = dbMessages.reverse()

        const messages = messageArrayValidator.parse(reverseDbMessages)

        return messages

    }catch(e) {
        notFound()
    }
}


const page = async ({params} : PageProps ) => {

    const { chatId } = params

    const session = await getServerSession(authOptions)
    if(!session) return notFound()

    const user = session?.user

    const [userId1, userId2] = chatId.split('--')

    if(user.id !== userId1 && user.id !== userId2) return notFound()
    
    const chatPartenerId = user.id === userId1 ? userId2 : userId1

    const chatPartner =  ( await db.get(`user:${chatPartenerId}`)) as User

    const initialMessages = await getChatMessages(chatId)

     
  return <div 
            className='flex flex-col justify-between flex-1 h-full max-h-[calc(100vh-2rem)] px-4'
  >
    <div className="flex items-center justify-between py-3 border-b-2 border-gray-400 ">
        <div className="relative flex items-center space-x-4">
            <div className="relative">
                <div className="relative w-8 sm:w-12 h-8 sm:h-12">
                    <Image 
                        fill
                        sizes='100%'
                        referrerPolicy="no-referrer"
                        src={chatPartner.image}
                        alt={chatPartner.name}
                        className="rounded-full"
                    />
                </div>
            </div>

            <div className="flex flex-col leading-tight">
                <div className="text-xl flex items-center">
                    <span className="text-slate-900 mr-3 font-semibold">{chatPartner.name}</span>
                </div>

                <span className='text-sm text-gray-700'>{chatPartner.email}</span>
            </div>


        </div>
    </div>

        <Messages initialMessages={initialMessages} sessionId={session?.user.id} chatPartner={chatPartner} sessionImg={session?.user.image} chatId={chatId} />
        <ChatInput chatId={chatId} chatPartner={chatPartner} />
  </div>
}

export default page