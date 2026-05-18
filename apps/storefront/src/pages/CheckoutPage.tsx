import { Link } from 'react-router'
import checkoutData from '@/data/checkout.json'

export default function CheckoutPage() {
  const { steps, backLink, sections, orderSummary, loginLink, loginHint, checkoutType } = checkoutData

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 py-8">
      {/* Steps */}
      <div className="flex items-center justify-center gap-4 mb-8 text-sm">
        {steps.map((step, i) => (
          <span key={i} className={`${step.current ? 'text-black font-medium' : 'text-gray-400'}`}>
            {i > 0 && <span className="mr-4 text-gray-300">&gt;</span>}
            {step.label}
          </span>
        ))}
      </div>

      {/* Back Link */}
      <Link to={backLink.href} className="text-sm text-gray-600 hover:text-black mb-6 inline-block">
        &larr; {backLink.label}
      </Link>

      {/* Login Hint for Guest */}
      {checkoutType === 'guest' && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center justify-between">
          <span className="text-sm">
            <Link to={loginLink.href} className="font-medium underline">{loginLink.label}</Link> {loginHint}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form Sections */}
        <div className="lg:col-span-2 space-y-8">
          {sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-lg font-semibold mb-4">{section.title}</h2>
              
              {section.type === 'contactDetails' && 'fields' in section && (
                <div className="space-y-4">
                  {section.fields?.map((field: any, j: number) => (
                    <input
                      key={j}
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  ))}
                  {'newsletterCheckbox' in section && section.newsletterCheckbox && (
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      {section.newsletterCheckbox.label}
                    </label>
                  )}
                </div>
              )}

              {section.type === 'shippingAddress' && 'fields' in section && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.fields?.map((field: any, j: number) => (
                    field.type === 'select' ? (
                      <select
                        key={j}
                        name={field.name}
                        defaultValue={field.defaultValue}
                        className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        {field.options?.map((opt: string, k: number) => (
                          <option key={k} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        key={j}
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        required={field.required}
                        className={`border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black ${field.name === 'address1' || field.name === 'address2' ? 'md:col-span-2' : ''}`}
                      />
                    )
                  ))}
                  {'defaultAddressCheckbox' in section && section.defaultAddressCheckbox && (
                    <label className="flex items-center gap-2 text-sm md:col-span-2">
                      <input type="checkbox" className="rounded" />
                      {section.defaultAddressCheckbox.label}
                    </label>
                  )}
                </div>
              )}

              {section.type === 'shippingMethod' && 'options' in section && (
                <div className="space-y-3">
                  {section.options?.map((opt: any) => (
                    <label key={opt.id} className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${opt.selected ? 'border-black bg-gray-50' : ''}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="shipping" defaultChecked={opt.selected} className="accent-black" />
                        <span className="text-sm">{opt.label}</span>
                      </div>
                      <span className="text-sm font-medium">{opt.priceLabel}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          <Link to="/review-and-pay">
            <button className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition">
              Continue to Review
            </button>
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Order Summary</h2>
              <Link to={orderSummary.editCartLink} className="text-sm text-gray-500 hover:text-black">Edit</Link>
            </div>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder={orderSummary.promoCode.placeholder}
                className="flex-1 border rounded px-3 py-2 text-sm"
              />
              <button className="px-4 py-2 border rounded text-sm hover:bg-gray-50">
                {orderSummary.promoCode.buttonText}
              </button>
            </div>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${orderSummary.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600">{orderSummary.shipping}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Tax</span>
                <span>{orderSummary.estimatedTax}</span>
              </div>
              {orderSummary.saleDiscount !== null && (
                <div className="flex justify-between text-red-600">
                  <span>Sale discount</span>
                  <span>${orderSummary.saleDiscount}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-base pt-3 border-t">
                <span>Total</span>
                <span>{orderSummary.currency === 'USD' && '$'}{orderSummary.total} {orderSummary.currency}</span>
              </div>
            </div>
            {/* Cart Items */}
            <div className="space-y-4">
              {orderSummary.items.map((item: any, i: number) => (
                <div key={i} className="flex gap-3">
                  <div className="w-16 h-20 bg-gray-100 rounded flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-500">{item.color} / {item.size}</p>
                    <p className="text-gray-500">Qty: {item.quantity}</p>
                    <p className="font-medium">${item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
