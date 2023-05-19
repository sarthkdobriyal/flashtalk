import Image from 'next/image'
import Button from '../components/ui/Button'
import  db  from '../../src/lib/utils/db'

export default async function Home() {

  await db.set("hello", "hello")

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-bgcolor">
      <h1 className="text-4xl md:text-6xl font-semibold font-freckleFace text-center text-secondary tracking-widest ">fl<span className='text-primary'>ash<span className='text-slate-700'>Talk.</span></span></h1>    
      <Button children={"Click Me"} />
    </main>
  )
}
