import { FC } from "react";
import { db } from "../../../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { getFriendsByUserId } from "@/helper/getFriends";
import { fetchRedis } from "@/helper/redis";
import { chatIdConstructor } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Page = async () => {

  const session = await getServerSession(authOptions);
  if (!session) return notFound();

  const friends = await getFriendsByUserId(session.user.id);
  const friendsWithLastMessage = await Promise.all(
    friends.map(async (friend) => {
      const [lastMessageRaw] = (await fetchRedis(
        "zrange",
        `chat:${chatIdConstructor(session.user.id, friend.id)}:messages`,
        -1,
        -1
      )) as strihng[];

      const lastMessage = JSON.parse(lastMessageRaw) as Message;

      return {
        ...friend,
        lastMessage,
      };
    })
  )

  return (
    <div className="container py-12 my-10 md:m-0">
    <span className="font-bold text-pink-900 font-bungeeInline text-5xl mb-20">
      Recent Chats
    </span>

    {
        friendsWithLastMessage.length === 0 ? (
          <p className='text-xl mt-4 font-light text-accent '>Start a conversation with a friend to see it here</p>
        ): (
          friendsWithLastMessage.map( (friend) => (

            <div  key={friend.id} 
            className='relative p-3 rounded-md bg-[#9933ff] shadow-xl  hover:bg-[#8c31e7] mt-5 font-baloo' >

<div className="absolute right-4 inset-y-0 flex items-center ">
                <ChevronRight className='h-7 w-7 text-xinc-700' />
              </div>

              <Link href={`/dashboard/chat/${chatIdConstructor(session.user.id,friend.id)}`}
                    className='relative sm:flex items-center gap-x-4'
              >


                      <div className='relative h-12 w-12 bg-transparent rounded-full'>
                            <Image
                                fill
                                sizes='100%'
                                referrerPolicy='no-referrer'
                                className='rounded-full'
                                src={friend.image || ''}
                                alt={friend.name}
                                />
                    </div>

                <div>
                  <h4 className="text-lg font-semibold">{friend.name}</h4>
                  <p className="mt-1 max-w-md">
                    <span className="text-zinc-600">
                      {
                        friend.lastMessage.senderId === session.user.id ? (
                          'You: '
                        ): ('')
                      }
                    </span>
                    {friend.lastMessage.text}
                  </p>
                </div>

              </Link>

            </div>


          ))
        )
        
      }


  </div>
  )
  
}

export default Page;
