import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, ShoppingBag, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Cart = () => {
  const { items, removeItem, totalPrice, clearCart } = useCart();

  const handleCheckout = () => {
    const message = items
      .map(
        (item) =>
          `*${item.tour.title}*\nFecha: ${item.date}\nAdultos: ${item.adults}, Niños: ${item.children}, Infantes: ${item.infants}\nSubtotal: $${
            item.tour.priceAdult * item.adults +
            item.tour.priceChild * item.children +
            item.tour.priceInfant * item.infants
          }`
      )
      .join("\n\n");

    const fullMessage = `Hola! Me gustaría reservar los siguientes tours:\n\n${message}\n\n*Total: $${totalPrice}*`;
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(fullMessage)}`;
    
    window.open(whatsappUrl, "_blank");
    toast.success("Redirigiendo a WhatsApp para finalizar tu reserva");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-bold">Tu carrito está vacío</h2>
          <p className="text-muted-foreground">¡Explora nuestros tours y comienza tu aventura!</p>
          <Link to="/">
            <Button className={buttonVariants({ variant: "default" })}>
              Explorar Tours
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Carrito de Compras</h1>
          <p className="text-muted-foreground">
            {items.length} {items.length === 1 ? "tour" : "tours"} en tu carrito
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const itemTotal =
                item.tour.priceAdult * item.adults +
                item.tour.priceChild * item.children +
                item.tour.priceInfant * item.infants;

              return (
                <Card key={item.tour.id}>
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row gap-4 p-4">
                      <img
                        src={item.tour.image}
                        alt={item.tour.title}
                        className="w-full sm:w-32 h-32 object-cover rounded-lg"
                      />
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-lg">{item.tour.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{item.date}</span>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {item.adults > 0 && (
                            <p>
                              {item.adults} Adulto{item.adults > 1 ? "s" : ""} × ${item.tour.priceAdult}
                            </p>
                          )}
                          {item.children > 0 && (
                            <p>
                              {item.children} Niño{item.children > 1 ? "s" : ""} × ${item.tour.priceChild}
                            </p>
                          )}
                          {item.infants > 0 && (
                            <p>
                              {item.infants} Infante{item.infants > 1 ? "s" : ""} × $
                              {item.tour.priceInfant}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-between gap-2">
                        <p className="text-2xl font-bold text-primary">${itemTotal}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            removeItem(item.tour.id);
                            toast.success("Tour eliminado del carrito");
                          }}
                        >
                          <Trash2 className="h-5 w-5 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Resumen de Compra</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map((item) => {
                    const itemTotal =
                      item.tour.priceAdult * item.adults +
                      item.tour.priceChild * item.children +
                      item.tour.priceInfant * item.infants;
                    return (
                      <div key={item.tour.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.tour.title}</span>
                        <span className="font-medium">${itemTotal}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-3xl font-bold text-primary">${totalPrice}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button
                  onClick={handleCheckout}
                  className={buttonVariants({ variant: "hero", className: "w-full" })}
                >
                  Finalizar Reserva por WhatsApp
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    clearCart();
                    toast.success("Carrito vaciado");
                  }}
                  className="w-full"
                >
                  Vaciar Carrito
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
