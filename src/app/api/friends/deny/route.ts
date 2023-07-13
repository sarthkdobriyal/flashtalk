import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import {pusherServer} from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const session = await getServerSession(authOptions);
    if (!session) return new Response("Unauthorized", { status: 401 });

    const {id: idToDeny} = z.object({ id: z.string() }).parse(body);
    console.log('idToDeny  ',idToDeny)

    pusherServer.trigger(toPusherKey(`user:${session.user.id}:friends`), 'new_friend', {})
    await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToDeny);

    return new Response("ok", { status: 200 });


  } catch (e) {
    if (e instanceof z.ZodError)
      return new Response("Invalid request payload", { status: 422 });

    return new Response("Invalid request", { status: 400 });
  }
}
