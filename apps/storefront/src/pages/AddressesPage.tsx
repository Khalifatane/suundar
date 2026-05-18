import addressesData from '@/data/addresses.json'
import Sidebar from '@/components/Sidebar'

export default function AddressesPage() {
  const { sidebar, pageContent } = addressesData

  const sidebarItems = sidebar.items.filter((item): item is { label: string; href: string; icon: string; active: boolean } => !('divider' in item))
  const hasDivider = sidebar.items.some(item => 'divider' in item)

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-12">
        {/* Sidebar */}
        <Sidebar title={sidebar.title} items={sidebarItems} hasDivider={hasDivider} />

        {/* Content */}
        <div className="flex-1">
          <h1 className="text-xl font-semibold mb-6">{pageContent.title}</h1>

          <div className="space-y-4 mb-6">
            {pageContent.addresses.map((address) => (
              <div key={address.id} className="border rounded-lg p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{address.label}</span>
                    {address.isDefault && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">Default</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    {address.actions.edit && (
                      <button className="text-gray-500 hover:text-black">Edit</button>
                    )}
                    {address.actions.setAsDefault && (
                      <button className="text-gray-500 hover:text-black">Set as default</button>
                    )}
                    {address.actions.remove && (
                      <button className="text-gray-500 hover:text-black">Remove</button>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">{address.name}</p>
                  <p>{address.street}</p>
                  <p>{address.city}</p>
                  <p>{address.state}</p>
                  <p>{address.country}</p>
                  <p className="mt-1">{address.phone}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            {pageContent.addAddressButton.label}
          </button>
        </div>
      </div>
    </main>
  )
}
