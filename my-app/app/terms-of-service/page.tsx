import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm p-8 sm:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 border-b-2 border-primary pb-4">
            Terms of Service
          </h1>
          <div className="prose prose-lg text-gray-600 space-y-8">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                Last updated: June 1, 2023
              </p>
              <p className="leading-relaxed">
                Welcome to Oiyn Shak. By using our website and services, you
                agree to comply with and be bound by the following terms and
                conditions of use. Please read these terms carefully before
                using our service.
              </p>
            </div>

            {termsSections.map((section, index) => (
              <section key={index} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-semibold">
                      {index + 1}
                    </span>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {section.title}
                  </h2>
                </div>
                <p className="leading-relaxed">{section.content}</p>
              </section>
            ))}

            <div className="mt-12 p-6 bg-primary/5 rounded-xl border border-primary/20">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Contact Us
              </h2>
              <p className="leading-relaxed">
                If you have any questions about these Terms of Service, please
                contact us at{" "}
                <a
                  href="mailto:legal@oiynshak.kz"
                  className="text-primary hover:underline"
                >
                  legal@oiynshak.kz
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

const termsSections = [
  {
    title: "Acceptance of Terms",
    content:
      "By accessing or using the Oiyn Shak service, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our service.",
  },
  {
    title: "Description of Service",
    content:
      "Oiyn Shak provides a toy rental subscription service. We offer various subscription plans that allow users to rent toys for a specified period.",
  },
  {
    title: "User Accounts",
    content:
      "To use our service, you must create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.",
  },
  {
    title: "Subscription and Billing",
    content:
      "By subscribing to Oiyn Shak, you agree to pay all fees associated with your chosen subscription plan. Fees are non-refundable except as expressly set forth in our Refund Policy.",
  },
  {
    title: "Toy Rental and Return",
    content:
      "You are responsible for returning rented toys in good condition, allowing for normal wear and tear. Late returns may incur additional fees.",
  },
  {
    title: "Limitation of Liability",
    content:
      "Oiyn Shak shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the service.",
  },
  {
    title: "Intellectual Property",
    content:
      "All content, design, and functionality of the Oiyn Shak service are owned by Oiyn Shak and are protected by copyright, trademark, and other intellectual property laws.",
  },
  {
    title: "Termination",
    content:
      "We reserve the right to terminate or suspend your account and access to the service at our sole discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users of the service, us, or third parties, or for any other reason.",
  },
  {
    title: "Changes to Terms",
    content:
      "We reserve the right to modify these Terms of Service at any time. We will notify users of any significant changes via email or through our website.",
  },
  {
    title: "Governing Law",
    content:
      "These Terms of Service shall be governed by and construed in accordance with the laws of Kazakhstan.",
  },
];
