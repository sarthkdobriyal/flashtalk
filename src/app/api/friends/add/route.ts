import { addFriendValidator } from '@/lib/validations/add-friend'
import { getServerSession} from 'next-auth/next'
import { authOptions } from '@/lib/auth'

import {fetchRedis} from '@/helper/redis'
import { db } from '@/lib/db'
import { z } from 'zod'
import { AxiosError } from 'axios'
import {pusherServer} from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'

export const POST = async (req: Request) => {
    try{
        const body = await req.json();
        const {email: emailToAdd} = addFriendValidator.parse(body.email);

        const idToAdd = await  fetchRedis('get', `user:email:${emailToAdd}`) as string | null


        if(!idToAdd) {
            return new Response('User not found', {status: 404})
        }

        const session = await getServerSession(authOptions)

        if(!session) {
            return new Response('Unauthorized', {status: 401})
        }

        if(idToAdd === session.user.id) {
            return new Response('You cannot add yourself as a friend', {status: 400})
        }

        //if already added
        const isAlreadyAdded = await  fetchRedis('sismember', `user:${idToAdd}:incoming_friend_requests`, session.user.id) as 0 | 1
        if(isAlreadyAdded) return new Response('Already added', {status: 400})



        //if already friend
        const isAlreadyfriend = await  fetchRedis('sismember', `user:${session.user.id}:friends`, idToAdd) as 0 | 1
        if(isAlreadyfriend) return new Response('Already Friends', {status: 400})

        
        //valid request
        await pusherServer.trigger(
            toPusherKey(`user:${idToAdd}:incoming_friend_requests`), 'incoming_friend_requests', {
                senderId: session.user.id,
                senderEmail: session.user.email,
                senderImage: session.user.image,
                senderName: session.user.name
            }
            )
            await db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id)
            
        return new Response('Friend request sent', {status: 200})

    }catch(e) { 

        if(e instanceof z.ZodError) {
            return new Response(e.message, {status: 400})
        }

        return new Response('Something went wrong', {status: 400})

    }
}