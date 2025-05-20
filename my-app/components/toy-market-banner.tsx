import { Button } from "@/components/ui/button";

export function ToyMarketBanner() {
  return (
    <div className="relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat dark:brightness-50"
        style={{
          backgroundImage: "url('/toy-market-banner.png')", // Path to your image
        }}
      />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-black">
        <div className="ml-10 sm:ml-16 md:ml-24">
          {" "}
          {/* Moves content slightly to the right */}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Welcome to Oiyn Shak Market
          </h1>
          <p className="mt-6 max-w-3xl text-xl">
            Discover a world of endless play possibilities. Rent, buy, or
            subscribe to access our vast collection of toys.
          </p>
          <div className="mt-10 flex items-center justify-start gap-x-6">
            <Button size="lg" className="rounded-full">
              Explore Toys
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full bg-white text-pink-600"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
