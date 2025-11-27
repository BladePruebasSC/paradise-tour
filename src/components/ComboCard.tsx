import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface ComboCardProps {
  combo: {
    id: string;
    title: string;
    description: string;
    tourIds?: string[];
    originalPrice: number;
    discountedPrice: number;
    discount: number;
    image: string;
  };
}

export const ComboCard = ({ combo }: ComboCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={combo.image}
          alt={combo.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
          {combo.discount}% OFF
        </Badge>
      </div>
      <CardContent className="p-4 space-y-2">
        <h3 className="text-xl font-bold">{combo.title}</h3>
        <p className="text-sm text-muted-foreground">{combo.description}</p>
        <div className="flex items-center gap-2">
          <span className="text-lg text-muted-foreground line-through">
            ${combo.originalPrice}
          </span>
          <span className="text-2xl font-bold text-primary">
            ${combo.discountedPrice}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link to={`/combo/${combo.id}`} className="w-full">
          <Button className={buttonVariants({ variant: "hero", className: "w-full" })}>
            Ver Combo
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
