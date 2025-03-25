import type React from "react"
import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "MA-1 AI - 智能助手",
  description: "专业的AI聊天助手，提供智能对话服务",
  generator: 'MA-1 AI',
  manifest: '/manifest.json',
  themeColor: '#000000',
  viewport: 'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MA-1 AI',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: ['/icons/icon-192x192.png'],
    apple: ['/icons/apple-touch-icon.png'],
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <head>
        <meta name="application-name" content="MA-1 AI 助手" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MA-1 AI" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body>{children}</body>
    </html>
  )
}



import './globals.css'