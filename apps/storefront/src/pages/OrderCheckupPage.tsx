import { Link } from 'react-router'
import orderCheckupData from '@/data/order-checkup.json'

export default function OrderCheckupPage() {
  const { tabs, returningCustomer, trackOrder } = orderCheckupData

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Tabs */}
        <div className="flex border-b mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex-1 py-3 text-center text-sm font-medium border-b-2 transition ${
                tab.active ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Returning Customer - Login Form */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">{tabs.find(t => t.id === 'returning')?.label}</h2>
          <form className="space-y-4">
            {returningCustomer.loginForm.fields.map((field, i) => (
              <div key={i}>
                <label className="block text-sm font-medium mb-1">{field.label}</label>
                <div className="relative">
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  {field.showToggle && (
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                {returningCustomer.loginForm.rememberMe.label}
              </label>
              <Link to={returningCustomer.loginForm.forgotPasswordLink.href} className="text-gray-500 hover:text-black underline">
                {returningCustomer.loginForm.forgotPasswordLink.label}
              </Link>
            </div>
            <button type="submit" className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition">
              {returningCustomer.loginForm.submitButton}
            </button>
          </form>
        </div>

        {/* Track Order */}
        <div>
          <h2 className="text-lg font-semibold mb-4">{trackOrder.title}</h2>
          
          {/* Lookup By */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">{trackOrder.lookupBy.label}</label>
            <div className="flex gap-2">
              {trackOrder.lookupBy.options.map((opt) => (
                <button key={opt.id} className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <form className="space-y-4">
            {trackOrder.fields.map((field, i) => (
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
            <div className="flex justify-end">
              <Link to={trackOrder.helperLink.href} className="text-sm text-gray-500 hover:text-black">
                {trackOrder.helperLink.label}
              </Link>
            </div>
            <button type="submit" className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition">
              {trackOrder.submitButton}
            </button>
          </form>
          <p className="text-sm text-gray-600 mt-4">{trackOrder.createAccountDescription}</p>
          <Link to={trackOrder.createAccountLink.href} className="block text-center mt-2 text-sm text-gray-600 hover:text-black">
            {trackOrder.createAccountLink.label}
          </Link>
        </div>
      </div>
    </main>
  )
}
