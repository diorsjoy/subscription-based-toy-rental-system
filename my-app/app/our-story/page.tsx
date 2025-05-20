import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import Image from "next/image";

export default function OurStoryPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-16 text-center">
        <h1 className="text-4xl font-bold mb-8">Our Story</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
          <div className="flex flex-col items-center text-center">
            <p className="text-lg mb-4 max-w-2xl">
              Oiyn Shak was born out of a simple idea: what if we could provide
              children with access to a wide variety of toys without
              contributing to clutter and waste?
            </p>
            <p className="text-lg mb-4 max-w-2xl">
              Founded in 2020 by two parents, Aisha and Nurlan, who were
              frustrated with the constant cycle of buying toys that were
              quickly outgrown or forgotten, Oiyn Shak started as a small
              community project in Almaty.
            </p>
            <p className="text-lg max-w-2xl">
              What began as a local toy-sharing initiative among friends quickly
              grew into a full-fledged business as more families recognized the
              value of a toy rental service.
            </p>
          </div>
          <div className="relative h-64 md:h-full flex justify-center">
            <Image
              src="/images/founders.jpg"
              alt="Oiyn Shak Founders"
              layout="intrinsic"
              width={500}
              height={350}
              className="rounded-lg"
            />
          </div>
        </div>
        <div className="prose max-w-2xl mx-auto text-center">
          <h2>Our Growth</h2>
          <p>
            As word spread about Oiyn Shak, we expanded our operations to cover
            major cities across Kazakhstan. We invested in a state-of-the-art
            cleaning and sanitization process to ensure the safety and quality
            of our toys.
          </p>
          <p>
            In 2022, we launched our digital platform, making it easier for
            families to browse, select, and schedule toy deliveries from the
            comfort of their homes.
          </p>
          <h2>Our Vision</h2>
          <p>
            Today, Oiyn Shak serves thousands of families across Kazakhstan, but
            our core mission remains the same: to bring joy and learning to
            children while promoting sustainability.
          </p>
          <p>
            We envision a future where toy rental is the norm, not the
            exception. A future where children have access to a diverse range of
            high-quality toys, and parents can provide enriching play
            experiences without the burden of clutter or environmental guilt.
          </p>
          <p>Join us in reimagining the future of play – one toy at a time.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
