import React, { createContext, useContext, useState, useEffect } from "react";
import { dashboardUsersService, DashboardUser } from "@/lib/supabase/dashboard-users";

interface DashboardAuthContextType {
  user: DashboardUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (referralCode: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const DashboardAuthContext = createContext<DashboardAuthContextType | undefined>(undefined);

export const DashboardAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage
    const savedUser = localStorage.getItem("dashboard_user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("dashboard_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (referralCode: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const dashboardUser = await dashboardUsersService.getByReferralCode(referralCode);
      
      if (dashboardUser && dashboardUser.is_active) {
        setUser(dashboardUser);
        localStorage.setItem("dashboard_user", JSON.stringify(dashboardUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error during login:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("dashboard_user");
  };

  const refreshUser = async () => {
    if (!user) return;
    
    try {
      const updatedUser = await dashboardUsersService.getById(user.id);
      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem("dashboard_user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  };

  return (
    <DashboardAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </DashboardAuthContext.Provider>
  );
};

export const useDashboardAuth = () => {
  const context = useContext(DashboardAuthContext);
  if (!context) {
    throw new Error("useDashboardAuth must be used within DashboardAuthProvider");
  }
  return context;
};

