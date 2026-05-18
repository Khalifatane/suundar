import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import loginData from '@/data/login.json'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const { form } = loginData
  const { user, loading, signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && user) {
      navigate('/')
    }
  }, [loading, user, navigate])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    const result = await signIn(email, password)
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error || 'Unable to sign in. Please try again.')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-xl font-semibold mb-6 text-center">{form.title}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {form.fields.map((field, i) => (
            <div key={i}>
              <label className="block text-sm font-medium mb-1">{field.label}</label>
              <div className="relative">
                <input
                  type={field.type}
                  name={field.name}
                  value={field.name === 'email' ? email : password}
                  onChange={(e) =>
                    field.name === 'email' ? setEmail(e.target.value) : setPassword(e.target.value)
                  }
                  placeholder={field.placeholder}
                  required={field.required}
                  className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
                {field.showToggle && (
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              {form.rememberMe.label}
            </label>
            <Link to={form.forgotPasswordLink.href} className="text-gray-500 hover:text-black underline">
              {form.forgotPasswordLink.label}
            </Link>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-60"
          >
            {form.submitButton}
          </button>
        </form>
        <Link to={form.createAccountLink.href} className="block text-center mt-4 text-sm text-gray-600 hover:text-black">
          {form.createAccountLink.label}
        </Link>
      </div>
    </main>
  )
}
