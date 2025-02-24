import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function CarouselSize() {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent className="flex gap-4 mx-10">
        {Array.from({ length: 20 }).map((_, index) => (
          <CarouselItem key={index} className="flex-none max-h-[350px] md:basis-1/4 lg:basis-1/6">
            <Card className="w-full">
              <CardContent className="flex aspect-square items-center justify-center p-1 md:p-6">
                <span className="text-3xl font-semibold">{index + 1}</span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
