import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useIsAdmin() {
  return useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: userRes } = await supabase.auth.getUser();
      if (!userRes.user) return false;
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userRes.user.id)
        .eq("role", "admin")
        .maybeSingle();
      return !!data;
    },
    staleTime: 30_000,
  });
}

export function useSiteContent<T = Record<string, unknown>>(key: string, fallback: T) {
  return useQuery({
    queryKey: ["site-content", key],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_content")
        .select("value")
        .eq("key", key)
        .maybeSingle();
      return ((data?.value as T) ?? fallback) as T;
    },
    staleTime: 30_000,
  });
}
