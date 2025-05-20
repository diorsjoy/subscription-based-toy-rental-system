import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const teamMembers = [
  {
    name: "Almas Magzumov",
    role: "Co-Founder & CEO",
    bio: "With a background in early childhood education, Almas brings a deep understanding of child development to Oiyn Shak.",
    avatar: "/images/aisha.jpg",
  },
  {
    name: "Erkebulan Boltaikhan",
    role: "Co-Founder & COO",
    bio: "Erkebulan's experience in logistics and operations ensures that Oiyn Shak runs smoothly and efficiently.",
    avatar: "/images/nurlan.jpg",
  },

  {
    name: "Alina Nishan",
    role: "Chief Technology Officer",
    bio: "Alina leads our tech team, developing and maintaining the digital infrastructure that powers Oiyn Shak.",
    avatar: "/images/arman.jpg",
  },
];

export default function OurTeamPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8">Our Team</h1>
        <p className="text-xl mb-12">
          Meet the passionate individuals behind Oiyn Shak who work tirelessly
          to bring joy and learning to children across Kazakhstan.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <Card key={member.name}>
              <CardHeader className="flex flex-col items-center">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="mt-4">{member.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center font-semibold mb-2">{member.role}</p>
                <p className="text-center text-muted-foreground">
                  {member.bio}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
