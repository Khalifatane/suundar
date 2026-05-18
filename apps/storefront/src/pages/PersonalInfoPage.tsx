import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '@/contexts/AuthContext'
import { supabaseAuthService } from '@siggistore/services/storefront/supabase-service'
import Sidebar from '@/components/Sidebar'

const sidebarItems = [
  { label: 'Personal Info', href: '/personal-info', icon: 'User', active: true },
  { label: 'My Orders', href: '/my-orders', icon: 'ShoppingBag', active: false },
  { label: 'Addresses', href: '/addresses', icon: 'MapPin', active: false },
]

export default function PersonalInfoPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [loading, user, navigate])

  useEffect(() => {
    if (user?.user_metadata?.avatar_url) {
      setAvatarUrl(user.user_metadata.avatar_url)
    }
  }, [user])

  if (loading) {
    return (
      <main className="min-h-screen max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-12">
          <Sidebar title="My Account" items={sidebarItems} hasDivider={true} />
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!user) {
    return null
  }

  const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'User'
  const userEmail = user.email || ''
  const userPhone = user.user_metadata?.phone || ''

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    setUploading(true)
    try {
      const response = await supabaseAuthService.uploadAvatar(user.id, file)
      if (response.success) {
        const nextAvatarUrl = response.data!
        setAvatarUrl(nextAvatarUrl)
        localStorage.setItem('appUserAvatar', nextAvatarUrl)
      } else {
        alert('Upload failed: ' + response.error)
      }
    } catch (error) {
      alert('Upload error: ' + String(error))
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-12">
        {/* Sidebar */}
        <Sidebar title="My Account" items={sidebarItems} hasDivider={true} />

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-medium text-gray-500">{userName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div>
              <h1 className="text-xl font-semibold">{userName}</h1>
              <p className="text-sm text-gray-500">{userEmail}</p>
              {userPhone && <p className="text-sm text-gray-500">{userPhone}</p>}
            </div>
          </div>

          <div className="border rounded-lg divide-y">
            {/* Profile Photo */}
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-medium text-gray-500">{userName.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span className="text-sm font-medium">Profile photo</span>
              </div>
              <button
                onClick={handleUploadClick}
                disabled={uploading}
                className="text-sm text-gray-600 hover:text-black disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload new photo'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* First Name */}
            <div className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">First name</p>
                <p className="text-sm font-medium">{userName.split(' ')[0] || '—'}</p>
              </div>
              <button className="text-sm text-gray-500 hover:text-black">Edit</button>
            </div>

            {/* Last Name */}
            <div className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Last name</p>
                <p className="text-sm font-medium">{userName.split(' ').slice(1).join(' ') || '—'}</p>
              </div>
              <button className="text-sm text-gray-500 hover:text-black">Edit</button>
            </div>

            {/* Email */}
            <div className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-sm font-medium">{userEmail || '—'}</p>
              </div>
              <button className="text-sm text-gray-500 hover:text-black">Edit</button>
            </div>

            {/* Phone */}
            <div className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-sm font-medium">{userPhone || '—'}</p>
              </div>
              <button className="text-sm text-gray-500 hover:text-black">Edit</button>
            </div>

            {/* Password */}
            <div className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Password</p>
                <p className="text-sm text-gray-500">Change your account password</p>
              </div>
              <Link to="/forgot-password" className="px-4 py-2 border rounded text-sm hover:bg-gray-50">
                Change password
              </Link>
            </div>

            {/* Delete Account */}
            <div className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Delete account</p>
                <p className="text-sm text-gray-500">Permanently delete your account and all associated data</p>
              </div>
              <button className="px-4 py-2 border border-red-200 text-red-600 rounded text-sm hover:bg-red-50">
                Delete account
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
