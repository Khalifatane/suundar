import { Link } from 'react-router'
import reviewAndPayData from '@/data/review-and-pay.json'

export default function ReviewAndPayPage() {
  const { steps, backLink, sections, orderSummary, payButton } = reviewAndPayData

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

      <Link to={backLink.href} className="text-sm text-gray-600 hover:text-black mb-6 inline-block">
        &larr; {backLink.label}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Review Sections */}
        <div className="lg:col-span-2 space-y-6">
          {sections.map((section, i) => (
            <div key={i} className="border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-semibold">{section.title}</h2>
                <Link to={'editLink' in section ? (section as any).editLink : '#'} className="text-sm text-gray-500 hover:text-black">
                  Edit
                </Link>
              </div>

              {section.type === 'shippingAddress' && 'address' in section && (
                <div className="text-sm text-gray-600">
                  <p>{(section as any).address?.name}</p>
                  <p>{(section as any).address?.street}</p>
                  <p>{(section as any).address?.city}</p>
                  <p>{(section as any).address?.state}</p>
                  <p>{(section as any).address?.country}</p>
                  <p className="mt-2">{(section as any).address?.phone}</p>
                </div>
              )}

              {section.type === 'shippingMethod' && 'method' in section && (
                <div className="text-sm">
                  <span>{(section as any).method?.label}</span>
                  <span className="ml-2 font-medium">{(section as any).method?.price}</span>
                </div>
              )}

              {section.type === 'contactDetails' && 'email' in section && (
                <p className="text-sm text-gray-600">{(section as any).email}</p>
              )}

              {section.type === 'payment' && 'savedMethods' in section && (
                <div className="space-y-3">
                  {(section as any).savedMethods?.map((method: any) => (
                    <label key={method.id} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
                      <input type="radio" name="payment" defaultChecked={method.selected} className="accent-black" />
                      <span className="text-sm font-medium">{method.type}</span>
                      <span className="text-sm text-gray-500">**** {method.last4}</span>
                      <span className="text-sm text-gray-400 ml-auto">{method.expiry}</span>
                    </label>
                  ))}
                  <div className="border-t pt-3 mt-3">
                    <p className="text-sm text-gray-500 mb-2">Other methods</p>
                    <div className="space-y-2">
                      {(section as any).otherMethods?.map((method: any) => (
                        <label key={method.id} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
                          <input type="radio" name="payment" className="accent-black" />
                          <span className="text-sm">{method.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          <Link to="/order-confirmation">
            <button className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition">
              {payButton}
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
              <input type="text" placeholder={orderSummary.promoCode.placeholder} className="flex-1 border rounded px-3 py-2 text-sm" />
              <button className="px-4 py-2 border rounded text-sm hover:bg-gray-50">{orderSummary.promoCode.buttonText}</button>
            </div>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>${orderSummary.subtotal}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className="text-green-600">{orderSummary.shipping}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Estimated Tax</span><span>{orderSummary.estimatedTax}</span></div>
              {orderSummary.saleDiscount !== null && (
                <div className="flex justify-between text-red-600"><span>Sale discount</span><span>${orderSummary.saleDiscount}</span></div>
              )}
              <div className="flex justify-between font-semibold text-base pt-3 border-t">
                <span>Total</span>
                <span>{orderSummary.currency === 'USD' && '$'}{orderSummary.total} {orderSummary.currency}</span>
              </div>
            </div>
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
