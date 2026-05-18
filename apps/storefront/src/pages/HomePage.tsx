import { Link } from 'react-router'
import homeData from '@/data/home.json'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full">
        <div 
          className="relative w-full h-[400px] md:h-[500px] bg-cover bg-center rounded-lg mx-auto max-w-6xl mt-4"
          style={{ backgroundImage: `url(${homeData.hero.backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/30 rounded-lg" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
            <span className="text-sm uppercase tracking-widest mb-2 opacity-90">{homeData.hero.badge}</span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{homeData.hero.title}</h1>
            <div className="flex gap-4">
              {homeData.hero.buttons.map((btn, i) => (
                <Link
                  key={i}
                  to={btn.href}
                  className="text-white underline underline-offset-4 hover:opacity-80 transition"
                >
                  {btn.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {homeData.sections[0].categories?.map((cat: any, i: number) => (
            <Link
              key={i}
              to={cat.href}
              className="group relative overflow-hidden rounded-lg aspect-square"
            >
              <div className="absolute inset-0 bg-gray-200 group-hover:scale-105 transition-transform duration-300" />
              <span className="absolute inset-0 flex items-center justify-center text-lg font-medium bg-black/20 text-white">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-6">Featured Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {homeData.sections[1].products?.map((prod: any, i: number) => (
            <Link key={i} to={prod.href} className="group block">
              <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-3 group-hover:shadow-md transition" />
              <p className="text-sm text-gray-600">Product {i + 1}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
