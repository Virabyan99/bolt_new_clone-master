'use client'
import AppSidebar from '@/components/custom/AppSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { ActionContext } from '@/context/ActionContext'
import { MessagesContext } from '@/context/MessagesContext'
import { UserDetailContext } from '@/context/UserDetailContext'
import { api } from '@/convex/_generated/api'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { useConvex } from 'convex/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

function Provider({ children }) {
  const [messages, setMessages] = useState()
  const [userDetail, setUserDetail] = useState()
  const convex = useConvex()
  const [action, setAction] = useState()
  const router = useRouter()

  useEffect(() => {
    IsAuthenticated()
  }, [])

  const IsAuthenticated = async () => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user'))
      if (!user) {
        router.push('/')
        return
      }
      // Fetch from Database
      const result = await convex.query(api.users.GetUser, {
        email: user?.email,
      })
      setUserDetail(result)
      console.log(result)
    }
  }
  return (
    <div>
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY}>
        <PayPalScriptProvider
          options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}>
          <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
            <MessagesContext.Provider value={{ messages, setMessages }}>
              <ActionContext.Provider value={{ action, setAction }}>
                <NextThemesProvider
                  attribute="class"
                  defaultTheme="dark"
                  enableSystem
                  disableTransitionOnChange>
                  <SidebarProvider defaultOpen={false}>
                    <AppSidebar />
                    {children}
                  </SidebarProvider>
                </NextThemesProvider>
              </ActionContext.Provider>
            </MessagesContext.Provider>
          </UserDetailContext.Provider>
        </PayPalScriptProvider>
      </GoogleOAuthProvider>
    </div>
  )
}

export default Provider
