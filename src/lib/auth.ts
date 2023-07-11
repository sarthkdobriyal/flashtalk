import {NextAuthOptions} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import upstashRedisClient from "@upstash/redis";
import { db } from "./db";
import { fetchRedis } from "@/helper/redis";
// import { fetchRedis } from '@/helpers/redis'

export const authOptions:NextAuthOptins =  {
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages:{
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET!,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks:{
    async jwt ({token, user}) {
      const dbUserResult = (await fetchRedis('get', `user:${token.id}`)) as string | null

      if(!dbUserResult) {
        token.id = user!.id
        return token
      }
      
      const dbUser = JSON.parse(dbUserResult) as User
    

      return {
        id: dbUser.id,
        name: dbUser.name, 
        email: dbUser.email,
        image: dbUser.image,
      }
    },
    async session ({session, token}) {
      if (token) {
        session.user.id = token.id,
        session.user.name = token.name,
        session.user.email = token.email,
        session.user.image = token.image
      }

      return session
    },
    redirect(){
      return '/dashboard'
    }
  }
};