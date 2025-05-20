import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navigation />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <div className="max-w-12xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-xl ring-1 ring-gray-100/10">
          <header className="text-center mb-12">
            <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Redefining Play, Sustainably
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              About Oiyn Shak
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pioneering a new era of eco-conscious play and learning through
              our innovative toy rental platform
            </p>
          </header>

          <div className="space-y-10 text-gray-700 leading-relaxed">
            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1.5">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800">
                    🧸
                  </span>
                </div>
                <p className="text-lg text-gray-800 flex-1">
                  Oiyn Shak is a revolutionary toy rental service that brings
                  joy and learning to children while promoting sustainability
                  and reducing clutter in homes.
                </p>
              </div>
            </section>

            <div className="grid md:grid-cols-2 gap-8 bg-blue-50 p-8 rounded-xl">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-800">
                      🌱
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
                    <p className="text-gray-700">
                      Provide access to high-quality, educational toys without
                      ownership burdens, fostering creativity and development
                      through continuous discovery.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-800">
                      ♻️
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">
                      Sustainability Promise
                    </h3>
                    <p className="text-gray-700">
                      Reduce toy waste by 70% through our sharing economy model,
                      promoting environmental consciousness in play.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1.5">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-800">
                    🎯
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-4">
                    Curated Excellence
                  </h3>
                  <p className="text-gray-700">
                    Our expert team meticulously selects each toy based on
                    safety standards, educational value, and developmental
                    benefits. We offer:
                  </p>
                  <ul className="list-disc pl-6 space-y-3 mt-3 text-gray-700">
                    <li>Age-appropriate learning tools</li>
                    <li>STEAM-focused educational toys</li>
                    <li>Social development games</li>
                    <li>Creative expression kits</li>
                  </ul>
                </div>
              </div>
            </section>

            <div className="bg-green-50 p-8 rounded-xl space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-semibold mb-4">By the Numbers</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { number: "5K+", label: "Toys Available" },
                    { number: "98%", label: "Satisfaction Rate" },
                    { number: "200+", label: "Eco-Saves Daily" },
                    { number: "4.9★", label: "Parent Rating" },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="p-4 bg-white rounded-lg shadow-sm"
                    >
                      <div className="text-2xl font-bold text-green-700">
                        {stat.number}
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <section className="text-center py-8">
              <p className="text-xl font-medium text-gray-900">
                Join <span className="text-green-700">2,500+ families</span> in
                Kazakhstan embracing smarter, sustainable play
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
