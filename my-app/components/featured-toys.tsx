import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarIcon } from "lucide-react"

const featuredToys = [
  {
    id: 1,
    title: "LEGO City Space Set",
    description: "Build and explore an entire space mission with this LEGO City set.",
    ageRange: "6-12 years",
    category: "Building & Construction",
    rating: 4.8,
  },
  {
    id: 2,
    title: "Melissa & Doug Wooden Kitchen",
    description: "A realistic play kitchen set for budding young chefs.",
    ageRange: "3-8 years",
    category: "Pretend Play",
    rating: 4.9,
  },
  {
    id: 3,
    title: "Magna-Tiles Clear Colors Set",
    description: "Colorful magnetic building tiles for endless creative possibilities.",
    ageRange: "3+ years",
    category: "Educational",
    rating: 4.7,
  },
]

export function FeaturedToys() {
  return (
    <section className="py-16 px-6">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Featured Toys</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredToys.map((toy) => (
            <Card key={toy.id} className="group relative overflow-hidden transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{toy.title}</CardTitle>
                    <CardDescription className="mt-2">{toy.description}</CardDescription>
                  </div>
                  <Badge variant="secondary">{toy.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 text-yellow-500">
                  <StarIcon className="h-4 w-4 fill-current" />
                  <span className="text-sm font-medium">{toy.rating}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Age: {toy.ageRange}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Add to Cart</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

