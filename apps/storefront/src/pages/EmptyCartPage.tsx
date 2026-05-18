import { Link } from 'react-router'
import emptyCartData from '@/data/empty-cart.json'

export default function EmptyCartPage() {
  const { heading, description, actionButton } = emptyCartData

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
        </div>
        <h1 className="text-xl font-semibold mb-2">{heading}</h1>
        <p className="text-gray-600 mb-6">{description}</p>
        <Link
          to={actionButton.href}
          className="inline-flex items-center gap-2 px-6 py-3 border rounded-lg hover:bg-gray-50 transition"
        >
          {actionButton.label}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </Link>
      </div>
    </main>
  )
}
