import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Intrduction } from "@/components/student/intro";
import { Lesson } from "@/components/student/lessons";
import { Music } from "@/components/student/music";
import { useMe } from "@/hooks/use-auth";

export default function Home() {
  const { data: me, isSuccess } = useMe();
  const affirmations = [
    "I am a creative and innovative artist, expressing my unique style and individuality in my work.",
    "I am a skilled and confident beauty professional, capable of achieving great things.",
    "I embrace continuous learning and strive for excellence in all aspects of my beauty practice.",
    "I provide exceptional service to my clients, enhancing their natural beauty and boosting their self-esteem.",
    "I am beautiful inside and out, and I deserve to feel confident and radiant.",
    "I embrace my unique beauty and celebrate my individuality.",
    "I radiate confidence and inner peace, attracting positive energy into my life.",
    "I feel confident and beautiful in my own skin, no matter what.",
  ];

  return (
    <Tabs defaultValue="main">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="main">Home</TabsTrigger>
        <TabsTrigger value="intro">Introduction</TabsTrigger>
        <TabsTrigger disabled={isSuccess && !me.is_active} value="lesson">
          Lessons
        </TabsTrigger>
        <TabsTrigger disabled={isSuccess && !me.is_active} value="music">
          Relaxing Music
        </TabsTrigger>
      </TabsList>
      <TabsContent value="main">
        <Card>
          <CardContent className="space-y-2">
            <div className="bg-red-400">
              <div className="grid min-h-svh lg:grid-cols-2">
                <div className="flex flex-col gap-4 p-6 md:p-10">
                  <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                      <Carousel
                        plugins={[
                          Autoplay({
                            delay: 2000,
                          }),
                        ]}
                      >
                        <CarouselContent>
                          {affirmations.map((affirmation, index) => (
                            <CarouselItem
                              key={index}
                              className="text-lg text-white font-medium"
                            >
                              {affirmation}
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                      </Carousel>
                    </div>
                  </div>
                </div>
                <div className="relative hidden bg-muted lg:block">
                  <img
                    src="/img/admin2.jpg"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale "
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="intro">
        <Card>
          <Intrduction />
        </Card>
      </TabsContent>

      <TabsContent value="lesson">
        <Card>
          <CardContent className="space-y-2">
            <Lesson />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="music">
        <Card
          className="w-full h-screen" // Ensure the card spans the full screen
          style={{
            backgroundImage: `url(/img/sb.jpeg)`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover", // Make the image cover the entire area
            backgroundPosition: "center", // Center the image
            display: "flex", // Use Flexbox
            justifyContent: "center", // Center horizontally
            alignItems: "center", // Center vertically
          }}
        >
          <CardContent className="space-y-2">
            <div className="">
              <Music />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
