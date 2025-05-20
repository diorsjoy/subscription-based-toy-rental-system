import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navigation />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <div className="max-w-6xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-xl ring-1 ring-gray-100/10">
          <header className="text-center mb-10">
            <div className="mb-6">
              <span className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Transparency & Trust
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <div className="flex items-center justify-center space-x-2 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm font-medium">Last updated: June 1, 2023</p>
            </div>
          </header>

          <div className="space-y-10 text-gray-700 leading-relaxed">
            <section className="space-y-4">
              <p className="text-lg text-gray-800">
                At{" "}
                <strong className="font-semibold text-blue-700">
                  Oiyn Shak
                </strong>
                , we take your privacy seriously. This Privacy Policy explains
                how we collect, use, disclose, and safeguard your information
                when you visit our website or use our toy rental service.
              </p>
            </section>

            {[
              {
                title: "Information We Collect",
                content:
                  "We collect information that you provide directly to us, such as when you create an account, subscribe to our service, or contact us for support. This may include your name, email address, phone number, and payment information.",
              },
              {
                title: "How We Use Your Information",
                content:
                  "We use the information we collect to provide, maintain, and improve our services, to process your transactions, to send you technical notices and support messages, and to communicate with you about products, services, offers, and events.",
              },
              {
                title: "Information Sharing and Disclosure",
                content:
                  "We do not sell or rent your personal information to third parties. We may share your information with service providers who perform services on our behalf, such as payment processing and delivery services.",
              },
              {
                title: "Data Security",
                content:
                  "We implement appropriate technical and organizational measures to protect the security of your personal information. However, please note that no method of transmission over the Internet or electronic storage is 100% secure.",
              },
              {
                title: "Your Rights",
                content: (
                  <>
                    You have the right to access, correct, or delete your
                    personal information. You may also have the right to
                    restrict or object to certain processing of your data. To
                    exercise these rights, please contact us at{" "}
                    <a
                      href="mailto:privacy@oiynshak.kz"
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      privacy@oiynshak.kz
                    </a>
                    .
                  </>
                ),
              },
              {
                title: "Children's Privacy",
                content:
                  "Our service is intended for use by parents and guardians. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.",
              },
              {
                title: "Changes to This Policy",
                content:
                  "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last updated' date.",
              },
              {
                title: "Contact Us",
                content: (
                  <>
                    If you have any questions about this Privacy Policy, please
                    contact us at{" "}
                    <a
                      href="mailto:privacy@oiynshak.kz"
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      privacy@oiynshak.kz
                    </a>
                    .
                  </>
                ),
              },
            ].map((section, index) => (
              <section key={index} className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                  <span className="mr-3 text-blue-600">#</span>
                  {section.title}
                </h2>
                <p className="text-gray-700 pl-9 border-l-2 border-blue-100">
                  {section.content}
                </p>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
