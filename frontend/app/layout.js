import './globals.css'

export const metadata = {
  title: 'Paystack Payment Test',
  description: 'Testing Paystack payment integration with GHS',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
