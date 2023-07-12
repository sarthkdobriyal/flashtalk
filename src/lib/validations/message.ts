import {z} from 'zod';

export const messageValidator = z.object({
    id: z.string(),
    senderId: z.string(), 
    receiverId: z.string(), 
    text: z.string(), 
    timestamp: z.number(),
})

export const messageArrayValidator = z.array(messageValidator)

export type message = z.infer<typeof messageValidator>