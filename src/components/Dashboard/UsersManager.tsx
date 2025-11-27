import { useState } from "react";
import { dashboardUsersService, DashboardUser } from "@/lib/supabase/dashboard-users";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Copy, Users, DollarSign, TrendingUp } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

const UsersManager = () => {
  const { data: users = [], isLoading } = useQuery<DashboardUser[]>({
    queryKey: ['dashboard-users'],
    queryFn: () => dashboardUsersService.getAllActive(),
  });
  
  const [editingUser, setEditingUser] = useState<DashboardUser | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    referral_code: "",
    discount_percentage: 0,
  });

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      referral_code: "",
      discount_percentage: 0,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (user: DashboardUser) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      referral_code: user.referral_code,
      discount_percentage: user.discount_percentage,
    });
    setIsDialogOpen(true);
  };

  const generateReferralCode = (name: string): string => {
    const base = name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return base + random;
  };

  const handleSave = async () => {
    try {
      if (!formData.name.trim() || !formData.email.trim()) {
        toast.error("Nombre y email son requeridos");
        return;
      }

      const referralCode = formData.referral_code.trim() || generateReferralCode(formData.name);
      const baseUrl = window.location.origin;
      const referralLink = `${baseUrl}/?ref=${referralCode}`;

      if (editingUser) {
        await dashboardUsersService.update(editingUser.id, {
          name: formData.name,
          email: formData.email,
          referral_code: referralCode,
          referral_link: referralLink,
          discount_percentage: formData.discount_percentage,
        });
        toast.success("Usuario actualizado correctamente");
      } else {
        await dashboardUsersService.create({
          name: formData.name,
          email: formData.email,
          referral_code: referralCode,
          referral_link: referralLink,
          discount_percentage: formData.discount_percentage,
        });
        toast.success("Usuario creado correctamente");
      }

      // Invalidar y refrescar queries para actualizar el dashboard
      await queryClient.invalidateQueries({ queryKey: ['dashboard-users'] });
      await queryClient.refetchQueries({ queryKey: ['dashboard-users'] });
      setIsDialogOpen(false);
      setEditingUser(null);
    } catch (error) {
      toast.error("Error al guardar el usuario");
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      return;
    }

    setIsDeleting(id);
    try {
      await dashboardUsersService.update(id, { is_active: false });
      toast.success("Usuario desactivado");
      await queryClient.invalidateQueries({ queryKey: ['dashboard-users'] });
      await queryClient.refetchQueries({ queryKey: ['dashboard-users'] });
    } catch (error) {
      toast.error("Error al eliminar el usuario");
      console.error(error);
    } finally {
      setIsDeleting(null);
    }
  };

  const copyReferralLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success("Link copiado al portapapeles");
  };

  if (isLoading) {
    return <div className="text-center py-8">Cargando usuarios...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Gestión de Usuarios</h2>
          <p className="text-muted-foreground">
            Crea usuarios con links de referido personalizados y descuentos
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate} className={buttonVariants({ variant: "hero" })}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingUser ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
              <DialogDescription>
                {editingUser ? "Modifica la información del usuario" : "Crea un nuevo usuario con link de referido"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Juan Pérez"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="juan@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referral_code">Código de Referido</Label>
                <Input
                  id="referral_code"
                  value={formData.referral_code}
                  onChange={(e) => setFormData({ ...formData, referral_code: e.target.value.toUpperCase() })}
                  placeholder="Se genera automáticamente si se deja vacío"
                />
                <p className="text-xs text-muted-foreground">
                  Si se deja vacío, se generará automáticamente basado en el nombre
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount_percentage">Descuento (%)</Label>
                <Input
                  id="discount_percentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.discount_percentage}
                  onChange={(e) => setFormData({ ...formData, discount_percentage: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground">
                  Descuento que se aplicará cuando alguien use el link de referido (0-100%)
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className={buttonVariants({ variant: "hero", className: "flex-1" })}>
                  Guardar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
                <Badge>{user.role}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Código:</span>
                  <span className="font-mono font-semibold">{user.referral_code}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    value={user.referral_link}
                    readOnly
                    className="text-xs font-mono"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyReferralLink(user.referral_link)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {user.discount_percentage > 0 && (
                <div className="p-2 bg-green-50 rounded text-sm">
                  <span className="font-semibold text-green-700">
                    Descuento: {user.discount_percentage}%
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                    <Users className="h-3 w-3" />
                    Referidos
                  </div>
                  <div className="text-lg font-semibold">{user.total_referrals || 0}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                    <DollarSign className="h-3 w-3" />
                    Ganancias
                  </div>
                  <div className="text-lg font-semibold">${(user.total_earnings || 0).toFixed(2)}</div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(user)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(user.id)}
                  disabled={isDeleting === user.id}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UsersManager;

