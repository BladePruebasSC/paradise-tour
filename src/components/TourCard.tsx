import { Link } from "react-router-dom";
import { Tour } from "@/types/tour";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Clock, Star, Users } from "lucide-react";

interface TourCardProps {
  tour: Tour;
}

export const TourCard = ({ tour }: TourCardProps) => {
  return (
    <Card className="group overflow-hidden hover:shadow-[var(--shadow-card)] transition-all duration-300 hover:scale-[1.02]">
      <div className="relative overflow-hidden aspect-square">
        <img
          src={tour.image}
          alt={tour.title}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
        />
        <Badge className="absolute top-4 right-4 bg-background/90 text-foreground">
          {tour.category}
        </Badge>
        {tour.featured && (
          <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
            Destacado
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
          {tour.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {tour.description}
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{tour.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span>{tour.rating}</span>
            <span className="text-xs">({tour.reviews})</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Desde</p>
            <p className="text-2xl font-bold text-primary">
              ${tour.priceAdult}
              <span className="text-sm font-normal text-muted-foreground">/adulto</span>
            </p>
          </div>
          <Users className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link to={`/tour/${tour.id}`} className="w-full">
          <Button className={buttonVariants({ variant: "default", className: "w-full" })}>
            Ver Detalles
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
