import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const openPositions = [
  {
    title: "Toy Curator",
    department: "Product",
    location: "Almaty, Kazakhstan",
    description:
      "We're looking for a passionate Toy Curator to help us select and manage our toy inventory. The ideal candidate has a deep understanding of child development and a keen eye for quality educational toys.",
    icon: "🧸",
  },
  {
    title: "Full Stack Developer",
    department: "Engineering",
    location: "Remote",
    description:
      "Join our tech team in building and maintaining the digital infrastructure of Oiyn Shak. We're seeking a skilled Full Stack Developer with experience in React, Node.js, and cloud technologies.",
    icon: "💻",
  },
  {
    title: "Customer Support Specialist",
    department: "Customer Experience",
    location: "Astana, Kazakhstan",
    description:
      "Help us deliver exceptional customer service to our Oiyn Shak families. We're looking for empathetic, problem-solving individuals who can assist our customers via phone, email, and chat.",
    icon: "😊",
  },
  {
    title: "Logistics Coordinator",
    department: "Operations",
    location: "Almaty, Kazakhstan",
    description:
      "Oversee the efficient movement of toys from our warehouse to customers and back. The ideal candidate has experience in inventory management and logistics optimization.",
    icon: "🚚",
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navigation />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <div className="max-w-6xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-xl ring-1 ring-gray-100/10">
          <header className="text-center mb-12">
            <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              We're Hiring!
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Join Our Team
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Help us revolutionize playtime while growing your career at a
              purpose-driven startup
            </p>
          </header>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-8 text-center">
              Open Positions
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {openPositions.map((position, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow duration-200 group"
                >
                  <CardHeader className="flex flex-row items-start gap-4">
                    <div className="mt-1 p-3 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                      <span className="text-2xl">{position.icon}</span>
                    </div>
                    <div>
                      <CardTitle className="text-xl">
                        {position.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-block px-2 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                          {position.department}
                        </span>
                        <span className="text-sm text-gray-500">
                          • {position.location}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-6">{position.description}</p>
                    <Button className="w-full md:w-auto bg-green-600 hover:bg-green-700">
                      Apply Now →
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="py-12 px-8 bg-blue-50 rounded-xl">
            <h2 className="text-2xl font-semibold mb-8 text-center">
              Why Work at Oiyn Shak?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                {
                  icon: "🌍",
                  title: "Make an Impact",
                  text: "Shape childhood development and sustainability",
                },
                {
                  icon: "🚀",
                  title: "Growth Focus",
                  text: "Professional development opportunities",
                },
                {
                  icon: "💸",
                  title: "Great Pay",
                  text: "Competitive salary & benefits",
                },
                {
                  icon: "🏡",
                  title: "Flexibility",
                  text: "Remote/hybrid options available",
                },
                {
                  icon: "🎉",
                  title: "Fun Culture",
                  text: "Passionate, supportive team",
                },
              ].map((perk, index) => (
                <div
                  key={index}
                  className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl mb-3">{perk.icon}</div>
                  <h3 className="font-semibold mb-2">{perk.title}</h3>
                  <p className="text-sm text-gray-600">{perk.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12 text-center">
            <div className="bg-green-50 p-8 rounded-xl">
              <h2 className="text-xl font-semibold mb-4">
                Don't See Your Dream Role?
              </h2>
              <p className="text-gray-700 mb-4">
                We're always looking for talented individuals. Send us your
                resume and tell us how you can contribute!
              </p>
              <Button
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                Submit General Application
              </Button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
