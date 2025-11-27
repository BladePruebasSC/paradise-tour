import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardAuth } from "@/contexts/DashboardAuthContext";

const SecretAccess = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useDashboardAuth();

  useEffect(() => {
    let typedSequence = "";
    let timeout: NodeJS.Timeout;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignorar si se está escribiendo en un input, textarea o contenteditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // Agregar la tecla presionada a la secuencia
      typedSequence += e.key.toLowerCase();

      // Mantener solo los últimos 5 caracteres
      if (typedSequence.length > 5) {
        typedSequence = typedSequence.slice(-5);
      }

      // Verificar si se escribió "cderf"
      if (typedSequence === "cderf") {
        // Redirigir al dashboard
        if (isAuthenticated) {
          navigate("/dashboard");
        } else {
          navigate("/dashboard/login");
        }
        typedSequence = ""; // Resetear la secuencia
      }

      // Resetear la secuencia después de 2 segundos de inactividad
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        typedSequence = "";
      }, 2000);
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      clearTimeout(timeout);
    };
  }, [navigate, isAuthenticated]);

  return null; // Este componente no renderiza nada
};

export default SecretAccess;

