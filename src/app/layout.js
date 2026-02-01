import './globals.css'
export const metadata = { title: 'Fact Checker', description: 'AI-powered misinformation detection' }
export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>
}
