import {  getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'
import { fetchRedis } from '@/helper/redis'
import { db} from '@/lib/db'
import { Message, messageValidator } from '@/lib/validations/message'
import { nanoid } from 'nanoid'
import {pusherServer} from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'

export async function POST(req: Request) {
    try{
        const {text, chatId}: {text: string, chatId: string} = await req.json();
        

        const session = await getServerSession(authOptions)
        if(!session) return new Response('Unauthorized', {status: 401})

        const [userId1, userId2] = chatId.split('--')
        if(session.user.id !== userId1 && session.user.id !== userId2) return new Response('Unauthorized', {status: 401})

        const friendId = session.user.id === userId1 ? userId2 : userId1

        const isFriend = await fetchRedis('sismember', `user:${session.user.id}:friends`, friendId)
        if(!isFriend) return new Response('Unauthorized', {status: 401})

        const rawSender = await fetchRedis('get', `user:${session.user.id}`) as string
        const sender = JSON.parse(rawSender) as User
        
        const timestamp = Date.now()

        const messageData: Message = {
            id: nanoid(),
            senderId: session.user.id,
            text: text,
            timestamp: timestamp,
        }

        const message = messageValidator.parse(messageData)

         pusherServer.trigger(toPusherKey(`chat:${chatId}`), 'incoming_message', message)
         pusherServer.trigger(toPusherKey(`user:${friendId}:chats`), 'new_message', {
            
            senderImage: sender.image,
            senderName: sender.name,
            ...message,
        })


        await db.zadd(`chat:${chatId}:messages`, {
            score: timestamp,
            member: JSON.stringify(message)
        })
        

        return new Response('ok')
    }catch(e){
        if(e instanceof Error) return new Response(e.message,{status:500})

        return new Response('Internal Server Error', {status: 500})
    }
}