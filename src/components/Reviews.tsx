import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Star, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useVerifiedReviews } from "@/hooks/useReviews";
import { reviewsService } from "@/lib/supabase/reviews";

export const Reviews = () => {
  const { data: verifiedReviews = [], isLoading, refetch } = useVerifiedReviews();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 5,
    comment: ""
  });

  // Mostrar solo las 3 últimas reseñas verificadas
  const displayReviews = verifiedReviews.slice(0, 3);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.comment.trim()) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    setIsSubmitting(true);
    try {
      // Crear reseña con verified = false (pendiente)
      await reviewsService.create({
        tour_id: null, // Reseña general, no asociada a un tour específico
        name: formData.name,
        email: formData.email || null,
        rating: formData.rating,
        comment: formData.comment,
        verified: false, // Importante: queda pendiente hasta ser aprobada
      });

      setFormData({ name: "", email: "", rating: 5, comment: "" });
      setOpen(false);
      toast.success("¡Gracias por tu reseña! Será revisada antes de ser publicada.");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Error al enviar la reseña. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
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
                <label className="text-sm font-medium mb-2 block">Nombre *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Tu nombre"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Email (opcional)</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tu@email.com"
                  disabled={isSubmitting}
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
                      disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>

              <Button 
                type="submit" 
                className={buttonVariants({ variant: "default", className: "w-full" })}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Enviar Reseña"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Cargando reseñas...</p>
        </div>
      ) : displayReviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Aún no hay reseñas publicadas. ¡Sé el primero en dejar una!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayReviews.map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{review.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {review.created_at
                        ? new Date(review.created_at).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Fecha no disponible"}
                    </p>
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
      )}
    </section>
  );
};
