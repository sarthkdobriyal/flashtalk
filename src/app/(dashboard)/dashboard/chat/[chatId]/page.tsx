import { User, getServerSession } from 'next-auth'
import { authOptions} from '@/lib/auth'
import { FC } from 'react'
import { notFound } from 'next/navigation'
import { fetchRedis } from '@/helper/redis'
import { messageArrayValidator } from '../../../../../lib/validations/message'
import { db } from '@/lib/db'

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
        console.log(e.message)
        return notFound()
    }
}


const page: FC = async ({params} : PageProps ) => {

    const { chatId } = params

    const session = await getServerSession(authOptions)
    if(!session) return notFound()

    const { user } = session

    const [userId1, userId2] = chatId.split('--')

    if(user.id !== userId1 && user.id !== userId2) return notFound()
    
    const chatPartenerId = user.id === userId1 ? userId2 : userId1

    const chatPartener =  ( await db.get(`user:${chatPartenerId}`)) as User

    const initialMessages = await getChatMessages(chatId)


  return <div>{chatId}</div>
}

export default page