import { useState } from "react";
import { Hero } from "@/components/Hero";
import { CategoryFilter } from "@/components/CategoryFilter";
import { TourCard } from "@/components/TourCard";
import { ComboCard } from "@/components/ComboCard";
import { Reviews } from "@/components/Reviews";
import { Footer } from "@/components/Footer";
import { tours } from "@/lib/tours-data";
import { combos } from "@/lib/combos-data";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredTours =
    selectedCategory === "Todos"
      ? tours
      : tours.filter((tour) => tour.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      
      {/* Combos Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Combos Especiales
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ahorra más con nuestros paquetes combinados
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {combos.map((combo) => (
            <ComboCard key={combo.id} combo={combo} />
          ))}
        </div>
      </section>

      <section id="tours" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Tours Destacados
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explora nuestras mejores experiencias cuidadosamente seleccionadas para ti
          </p>
        </div>

        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </section>

      <Reviews />

      {/* Features Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl mb-4">🏖️</div>
              <h3 className="text-xl font-semibold text-foreground">Reserva Fácil</h3>
              <p className="text-muted-foreground">
                Proceso simple y rápido en pocos clics
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl mb-4">💯</div>
              <h3 className="text-xl font-semibold text-foreground">Mejor Precio</h3>
              <p className="text-muted-foreground">
                Precios especiales y descuentos exclusivos
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold text-foreground">Experiencia Garantizada</h3>
              <p className="text-muted-foreground">
                Tours con las mejores calificaciones
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
