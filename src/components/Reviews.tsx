import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Star, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

const mockReviews: Review[] = [
  {
    id: "1",
    name: "María González",
    rating: 5,
    comment: "¡Experiencia increíble! El tour de snorkel fue maravilloso, guías muy profesionales.",
    date: "2024-03-15"
  },
  {
    id: "2",
    name: "Carlos Rodríguez",
    rating: 5,
    comment: "El mejor tour que he tomado. Totalmente recomendado, volveremos pronto.",
    date: "2024-03-10"
  },
  {
    id: "3",
    name: "Ana Martínez",
    rating: 4,
    comment: "Muy buena experiencia, solo que el tour fue un poco corto. Pero todo excelente.",
    date: "2024-03-05"
  }
];

export const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    comment: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newReview: Review = {
      id: Date.now().toString(),
      name: formData.name,
      rating: formData.rating,
      comment: formData.comment,
      date: new Date().toISOString().split('T')[0]
    };

    setReviews([newReview, ...reviews]);
    setFormData({ name: "", rating: 5, comment: "" });
    setOpen(false);
    toast.success("¡Gracias por tu reseña!");
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-accent text-accent" : "text-muted-foreground"
        }`}
      />
    ));
  };

  return (
    <section id="reviews" className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Reseñas de Clientes
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          Lee lo que nuestros clientes dicen sobre sus experiencias
        </p>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className={buttonVariants({ variant: "hero" })}>
              Escribir Reseña
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Comparte tu Experiencia</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Nombre</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Tu nombre"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Calificación</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating })}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          rating <= formData.rating
                            ? "fill-accent text-accent"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Comentario</label>
                <Textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Cuéntanos sobre tu experiencia..."
                  required
                  rows={4}
                />
              </div>

              <Button type="submit" className={buttonVariants({ variant: "default", className: "w-full" })}>
                Enviar Reseña
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">{review.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-1">{renderStars(review.rating)}</div>
              <p className="text-sm text-muted-foreground">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
