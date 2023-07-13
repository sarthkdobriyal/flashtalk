"use client"
import { FC, useState } from 'react'
import Button from './ui/Button'
import {addFriendValidator} from '@/lib/validations/add-friend'
import axios, { AxiosError } from 'axios'
import { z } from 'zod'
import {useForm} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

interface AddFriendButtonProps {
  
}
//turning zod validator into a typescript type
type FormData = z.infer<typeof addFriendValidator>

const AddFriendButton: FC<AddFriendButtonProps> = ({}) => {

  const [showSuccess, setShowSuccess] = useState<boolean>(false)


  const {
    register, handleSubmit, setError, formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator)
  })

  const addFriend = async (email:string) => {
    try{
      const validatedEmail = addFriendValidator.parse({email})

      await axios.post('/api/friends/add', {
        email: validatedEmail,
      })
      setShowSuccess(true);

    }catch(e){
      if(e instanceof z.ZodError) {
        setError('email', {message: e.message})
        return
      }
      if(e instanceof  AxiosError){
        setError('email', {message: e.response?.data})
        return
      }

      setError('email', {message: 'Something went wrong'})

    }
  }


  const onSubmit = (data: FormData) => {
    addFriend(data.email)
  }



  return <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
    <label htmlFor="email" className='block text-sm font-baloo font-medium leading-6 text-gray-900'>
      Enter a friend&apos;s Email: 
    </label>

    <div className="mt-2 flex gap-4">
      <input 
        {...register('email')}
      type="text" className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:to-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ' placeholder='you@example.com'/>
      <Button>Add</Button>
    </div>
    <p className='m-1 text-base font-baloo text-red-600'>{errors.email?.message}</p>
    {showSuccess && <p className='m-3 text-lg font-baloo text-accent font-bold '>Friend request sent</p>}

  </form>

}

export default AddFriendButton