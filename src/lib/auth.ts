import {NextAuthOptions} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import upstashRedisClient from "@upstash/redis";
import { db } from "./db";

const redis = upstashRedisClient(
  process.env.UPSTASH_REDIS_URL,
  process.env.UPSTASH_REDIS_TOKEN
);

export const authOptions:NextAuthOptins =  {
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages:{
    signIn: '/login',
  }
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks:{
    async jwt ({token, user}) {
      const dbUser = await db.get({user: `${token.id}`}) as User | null
      if(!dbUser) {
        token.id = user!.id
        return token
      }
      return{
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