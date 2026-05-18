import { Link, useNavigate } from 'react-router'
import { useAuth } from '@/contexts/AuthContext'
import { clearClientAuthState } from '@/lib/auth'

interface SidebarItem {
  label: string
  href: string
  icon: string
  active: boolean
}

interface SidebarProps {
  title: string
  items: SidebarItem[]
  hasDivider?: boolean
}

const iconMap: Record<string, React.ReactNode> = {
  User: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  ShoppingBag: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  MapPin: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  LogOut: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
}

export default function Sidebar({ title, items, hasDivider = false }: SidebarProps) {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut()
    } finally {
      clearClientAuthState()
    }
    navigate('/login', { replace: true })
  }

  return (
    <aside className="w-64 flex-shrink-0 hidden md:block">
      <h2 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">{title}</h2>
      <nav className="space-y-1">
        {items.map((item, i) => (
          <Link
            key={i}
            to={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
              item.active
                ? 'bg-black text-white'
                : 'text-gray-600 hover:bg-gray-50 hover:text-black'
            }`}
          >
            {iconMap[item.icon]}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      {hasDivider && <div className="border-t my-4" />}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-black w-full text-left transition"
      >
        {iconMap['LogOut']}
        <span>Logout</span>
      </button>
    </aside>
  )
}
