import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";
import Image from "next/image";

const recommendedToys = [
  {
    id: 1,
    name: "STEM Building Blocks Set",
    description:
      "Educational toy for developing spatial reasoning and creativity.",
    rating: 4.8,
    tokens: 30,
    image: "/toy-images/image.png",
  },
  {
    id: 2,
    name: "Interactive Storytelling Robot",
    description:
      "AI-powered robot that tells interactive stories and asks questions.",
    rating: 4.7,
    tokens: 50,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 3,
    name: "Eco-friendly Art Kit",
    description: "Sustainable art supplies for eco-conscious young artists.",
    rating: 4.6,
    tokens: 25,
    image: "/placeholder.svg?height=200&width=200",
  },
];

export function ToyRecommendations() {
  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold mb-4">Recommended for You</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendedToys.map((toy) => (
          <Card key={toy.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{toy.name}</span>
                <span className="text-lg font-normal">{toy.tokens} tokens</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-48 mb-4">
                <Image
                  src={toy.image || "/placeholder.svg"}
                  alt={toy.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
              <p className="text-sm mb-2">{toy.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-sm font-medium">{toy.rating}</span>
                </div>
                <Button variant="secondary">Add to Cart</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
