import { FC } from 'react'
import {cn} from '@/lib/utils'
import { toast, type Toast } from 'react-hot-toast'
import { chatIdConstructor } from '@/lib/utils'
import Image from 'next/image'

interface UnseenChatToastProps {
  t: Toast,
  senderId: string,
  sessionId: string,
  senderImage: string,
  senderName: string,
  senderMessage: string
}

const UnseenChatToast: FC<UnseenChatToastProps> = ({t, senderId, sessionId, senderImage, senderName, senderMessage}) => {
  return <div className={cn('max-w-md w-full bg-white shadow-lg pointer-events-auto flex ring-1 ring-opacity-5', 
    {
        'animate-enter': t.visible,
        'animate-leave': !t.visible
    }
  )}>
    <a href={`/dashboard/chat/${chatIdConstructor(sessionId, senderId)}`}
       onClick={() => toast.dismiss(t.id)}
       className='flex-1 w-0 p-4'
       >
        <div className='flex items-start'>
          <div className="flex-shrink-0 pt-0.5 ">
            <div className="relative h-10 w-10">
       
                            <Image
                                fill
                                sizes='100%'
                                src={senderImage || ''}
                                alt={senderName}
                                referrerPolicy='no-referrer'
                                className='rounded-full'
                                />
            
            </div>
          </div>

          <div className='ml-3 flex-1'>
              <p className='text-sm font-medium text-gray-900'>{senderName}</p>
              <p className="mt-1 text-sm text-gray-500">{senderMessage}</p>
          </div>

        </div>
      </a>

      <div className='flex border-l border-gray-200'>

        <button onClick={() => toast.dismiss(t.id)}
                className='w-full border border-transparent rounded-none rounded-r-md p-4 flex items-center justify-center text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent'
        >
          x
        </button>

      </div>
    </div>
}

export default UnseenChatToast