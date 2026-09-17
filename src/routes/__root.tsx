import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { ToastProvider } from '@/components/ui/Toast'
import { AppStoreProvider } from '@/lib/store'

import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'DHAN — Know your money. Grow your business.',
      },
      {
        name: 'description',
        content:
          'DHAN is a premium financial management platform for Indian MSMEs — track expenses, understand cash flow and make smarter business decisions.',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <AppStoreProvider>
          <ToastProvider>{children}</ToastProvider>
        </AppStoreProvider>
        <Scripts />
      </body>
    </html>
  )
}
