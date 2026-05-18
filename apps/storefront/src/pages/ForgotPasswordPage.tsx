import { Link } from 'react-router'
import forgotPasswordData from '@/data/forgot-password.json'

export default function ForgotPasswordPage() {
  const { form } = forgotPasswordData

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-xl font-semibold mb-1">{form.title}</h1>
        <p className="text-sm text-gray-600 mb-6">{form.description}</p>
        <form className="space-y-4">
          {form.fields.map((field, i) => (
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
          <button type="submit" className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition">
            {form.submitButton}
          </button>
        </form>
        <Link to={form.loginLink.href} className="block text-center mt-4 text-sm text-gray-600 hover:text-black">
          {form.loginLink.label}
        </Link>
      </div>
    </main>
  )
}
