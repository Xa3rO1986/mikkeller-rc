import { useQuery } from "@tanstack/react-query";
import type { Admin } from "@shared/schema";

export function useAuth() {
  const { data: admin, isLoading } = useQuery<Admin | null>({
    queryKey: ["/api/admin/current"],
    retry: false,
  });

  return {
    admin,
    isLoading,
    isAuthenticated: !!admin,
  };
}
