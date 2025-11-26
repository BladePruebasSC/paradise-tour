import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Search } from "lucide-react";
import heroImage from "@/assets/hero-beach.jpg";

export const Hero = () => {
  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Paradise beach"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-secondary/50" />
      </div>
      
      <div className="container mx-auto px-4 z-10 text-center text-white">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
          Descubre el Paraíso
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          Reserva tus tours favoritos de forma rápida y fácil. Vive experiencias inolvidables.
        </p>
        <div className="flex justify-center">
          <Button className={buttonVariants({ variant: "coral", size: "xl" })}>
            <Search className="mr-2 h-5 w-5" />
            Explorar Tours
          </Button>
        </div>
      </div>
    </section>
  );
};
