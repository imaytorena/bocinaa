// import { Inter } from 'next/font/google'
//
// const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Home',
  description: 'Hola este es el home',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
