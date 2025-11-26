import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tours } from "@/lib/tours-data";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { Clock, Star, Users, Calendar, Minus, Plus, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const tour = tours.find((t) => t.id === id);

  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");

  if (!tour) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Tour no encontrado</h1>
        <Button onClick={() => navigate("/")}>Volver al inicio</Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedDate) {
      toast.error("Por favor selecciona una fecha");
      return;
    }

    if (adults === 0 && children === 0) {
      toast.error("Debes agregar al menos un adulto o niño");
      return;
    }

    addItem({
      tour,
      adults,
      children,
      infants,
      date: selectedDate,
    });

    toast.success("Tour agregado al carrito");
    navigate("/carrito");
  };

  const totalPrice =
    tour.priceAdult * adults +
    tour.priceChild * children +
    tour.priceInfant * infants;

  const Counter = ({
    value,
    onChange,
    min = 0,
    label,
  }: {
    value: number;
    onChange: (v: number) => void;
    min?: number;
    label: string;
  }) => (
    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
      <span className="font-medium">{label}</span>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center font-semibold">{value}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onChange(value + 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image */}
      <div className="relative h-[400px] md:h-[500px]">
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <Badge className="absolute top-4 right-4 bg-background/90 text-foreground">
          {tour.category}
        </Badge>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-foreground">{tour.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-5 w-5" />
                  <span>{tour.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-accent text-accent" />
                  <span className="font-semibold">{tour.rating}</span>
                  <span>({tour.reviews} reseñas)</span>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Descripción</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{tour.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Incluye</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tour.includes.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Reserva tu Tour</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Date Selection */}
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Fecha
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                {/* Passenger Counters */}
                <div className="space-y-3">
                  <Counter
                    value={adults}
                    onChange={setAdults}
                    min={0}
                    label={`Adultos - $${tour.priceAdult}`}
                  />
                  <Counter
                    value={children}
                    onChange={setChildren}
                    label={`Niños - $${tour.priceChild}`}
                  />
                  <Counter
                    value={infants}
                    onChange={setInfants}
                    label={`Infantes - ${tour.priceInfant === 0 ? "Gratis" : `$${tour.priceInfant}`}`}
                  />
                </div>

                {/* Price Summary */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-3xl font-bold text-primary">
                      ${totalPrice}
                    </span>
                  </div>
                  <Button
                    onClick={handleAddToCart}
                    className={buttonVariants({ variant: "hero", className: "w-full" })}
                  >
                    Agregar al Carrito
                  </Button>
                  <a
                    href={`https://wa.me/1234567890?text=Hola, estoy interesado en el tour: ${tour.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-2"
                  >
                    <Button className={buttonVariants({ variant: "outline", className: "w-full" })}>
                      Consultar por WhatsApp
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetail;
