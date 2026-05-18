import { Link } from 'react-router'
import checkoutNotLoggedInData from '@/data/checkout-not-logged-in.json'

export default function CheckoutNotLoggedInPage() {
  const { tabs, guestSection, loginForm } = checkoutNotLoggedInData

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Tabs */}
        <div className="flex border-b mb-8">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              to={tab.id === 'guest' ? '/checkout' : '#'}
              className={`flex-1 py-3 text-center text-sm font-medium border-b-2 transition ${
                tab.active ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Guest Section */}
        <div className="mb-8">
          <p className="text-sm text-gray-600 mb-4">{guestSection.description}</p>
          <Link
            to={guestSection.actionButton.href}
            className="w-full py-3 border rounded-lg flex items-center justify-between px-4 hover:bg-gray-50 transition"
          >
            <span className="font-medium">{guestSection.actionButton.label}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>

        {/* Login Form */}
        <div>
          <h2 className="text-lg font-semibold mb-4">{loginForm.title}</h2>
          <form className="space-y-4">
            {loginForm.fields.map((field, i) => (
              <div key={i}>
                <label className="block text-sm font-medium mb-1">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            ))}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                {loginForm.rememberMe.label}
              </label>
              <Link to={loginForm.forgotPasswordLink.href} className="text-gray-500 hover:text-black underline">
                {loginForm.forgotPasswordLink.label}
              </Link>
            </div>
            <button type="submit" className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition">
              {loginForm.submitButton}
            </button>
          </form>
          <Link to={loginForm.createAccountLink.href} className="block text-center mt-4 text-sm text-gray-600 hover:text-black">
            {loginForm.createAccountLink.label}
          </Link>
        </div>
      </div>
    </main>
  )
}
