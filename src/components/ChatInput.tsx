'use client'
import { FC, useRef, useState } from 'react'
import TextAreaAutosize from 'react-textarea-autosize'
import Button from '@/components/ui/Button'
import axios from 'axios'
import { chatIdConstructor } from '@/lib/utils'
import { toast } from 'react-hot-toast'

interface ChatInputProps {
    chatId: string,
    chatPartner: User
}

const ChatInput: FC =  ({chatId,chatPartner} : ChatInputProps) => {

    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [input, setInput] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const sendMessage= async () => {
        setLoading(true)
        try{
            if(input.length === 0) {
                toast.error('Message cannot be empty')
                return
            }
            await axios.post('/api/message/send', {text: input, chatId: chatId })
            setInput('')
            textareaRef.current?.focus()
        }catch(e){
            toast.error('Something went wrong')
        }finally{
            setLoading(false)
        }
    }

  return <div className='border-t px-8 pt-4 border-gray-300 sm:mb-0'>

    <div className="flex relative flex-1 overflow-hidden rounded-lg ring-1 shadow-sm ring-gray-400 focus-within:ring-2 focus-within:ring-fuchsia-900">
        <TextAreaAutosize ref={textareaRef} onKeyDown={(e) => {
            if(e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
        }}} rows={1} value={input} onChange={(e) => setInput(e.target.value)} placeholder={`Message ${chatPartner.name}`} className='block w-full resize-none border-0 bg-transparent text-gray-300 placeholder:text-gray-700 focus:ring-0 sm:py-1.5 sm:text-base sm:leading-6' />

        <div onClick={() => {
            textareaRef.current?.focus()
        }}
        className='py-2'
        aria-hidden='true'
        >
        <div className='py-px'>     
            <div className='h-12' />
        </div>

        </div>


        <div className="absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2 ">            
            <div className="flex-shrink-0 ">
                <Button isLoading={loading} onClick={sendMessage} type='submit'>Send</Button>
            </div>
        </div>

    </div>
    
  </div>
}

export default ChatInput