import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Toaster } from '@/components/toaster' //Import Toaster component
import { AuthProvider } from './components/authProvider'; //Import AuthProvider

export const metadata: Metadata = {
  title: 'Kids Coder',
  description: 'AI-Powered Code Generator for Young Learners',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}