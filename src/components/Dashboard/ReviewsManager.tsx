import { useState } from "react";
import { useReviews } from "@/hooks/useReviews";
import { reviewsService } from "@/lib/supabase/reviews";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Check, X, Trash2, Star, Mail, Calendar } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const ReviewsManager = () => {
  const { data: reviews = [], isLoading } = useReviews();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const verifiedReviews = reviews.filter((r) => r.verified);
  const pendingReviews = reviews.filter((r) => !r.verified);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await reviewsService.approve(id);
      toast.success("Reseña aceptada");
      await queryClient.invalidateQueries({ queryKey: ["reviews"] });
      await queryClient.refetchQueries({ queryKey: ["reviews"] });
    } catch (error) {
      toast.error("Error al aceptar la reseña");
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      await reviewsService.reject(id);
      toast.success("Reseña rechazada");
      await queryClient.invalidateQueries({ queryKey: ["reviews"] });
      await queryClient.refetchQueries({ queryKey: ["reviews"] });
    } catch (error) {
      toast.error("Error al rechazar la reseña");
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta reseña?")) {
      return;
    }

    setProcessingId(id);
    try {
      await reviewsService.delete(id);
      toast.success("Reseña eliminada");
      await queryClient.invalidateQueries({ queryKey: ["reviews"] });
      await queryClient.refetchQueries({ queryKey: ["reviews"] });
    } catch (error) {
      toast.error("Error al eliminar la reseña");
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const ReviewCard = ({ review }: { review: any }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">{review.name}</CardTitle>
              {review.verified ? (
                <Badge className="bg-green-500">Verificada</Badge>
              ) : (
                <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                  Pendiente
                </Badge>
              )}
            </div>
            {review.email && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Mail className="h-3 w-3" />
                <span>{review.email}</span>
              </div>
            )}
            {review.tour_id && (
              <div className="text-sm text-muted-foreground mb-2">
                Tour ID: {review.tour_id}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                {review.created_at
                  ? new Date(review.created_at).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Fecha no disponible"}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-1">{renderStars(review.rating)}</div>
            <span className="text-sm font-semibold">{review.rating}/5</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base mb-4">{review.comment}</CardDescription>
        <div className="flex gap-2">
          {!review.verified ? (
            <Button
              size="sm"
              onClick={() => handleApprove(review.id)}
              disabled={processingId === review.id}
              className={buttonVariants({ variant: "default", className: "bg-green-600 hover:bg-green-700" })}
            >
              <Check className="h-4 w-4 mr-2" />
              Aceptar
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleReject(review.id)}
              disabled={processingId === review.id}
            >
              <X className="h-4 w-4 mr-2" />
              Rechazar
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDelete(review.id)}
            disabled={processingId === review.id}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return <div className="text-center py-8">Cargando reseñas...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Gestión de Reseñas</h2>
        <p className="text-muted-foreground">
          Administra las reseñas de tus clientes: acepta, rechaza o elimina reseñas
        </p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">
            Pendientes ({pendingReviews.length})
          </TabsTrigger>
          <TabsTrigger value="verified">
            Verificadas ({verifiedReviews.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingReviews.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No hay reseñas pendientes
              </CardContent>
            </Card>
          ) : (
            pendingReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          )}
        </TabsContent>

        <TabsContent value="verified" className="space-y-4">
          {verifiedReviews.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No hay reseñas verificadas
              </CardContent>
            </Card>
          ) : (
            verifiedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReviewsManager;

