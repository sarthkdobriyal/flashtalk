'use client'
import { FC, useRef, useState } from 'react'
import TextAreaAutosize from 'react-textarea-autosize'

interface ChatInputProps {
    chatPartner: User
}

const ChatInput: FC<ChatInputProps> = ({chatPartner}) => {

    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [input, setInput] = useState<string>('')

    const sendMessage= () => {}

  return <div className='border-t px-4 pt-4 border-gray-300 mb-2 sm:mb-0'>

    <div className="flex relative flex-1 overflow-hidden rounded-lg ring-1 shadow-sm ring-gray-400 focus-within:ring-2 focus-within:ring-fuchsia-900">
        <TextAreaAutosize ref={textareaRef} onKeyDown={(e) => {
            if(e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
        }}} rows={1} value={input} onChange={(e) => setInput(e.target.value)} placeholder={`Message ${chatPartner.name}`} className='block w-full resize-none border-0 bg-transparent text-gray-300 placeholder:text-gray-700 focus:ring-0 sm:py-1.5 sm:text-base sm:leading-6 overflow-y-auto' />
    </div>
    
  </div>
}

export default ChatInput