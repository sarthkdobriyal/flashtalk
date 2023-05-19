import './globals.css'
import Providers from '../components/Providers'

export const metadata = {
  title: 'flashTalk',
  description: 'An instant chat application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"></link>
      </head>
      <body className='font-baloo'>
      <Providers>
        {children}
      </Providers>
        </body>
    </html>
  )
}
