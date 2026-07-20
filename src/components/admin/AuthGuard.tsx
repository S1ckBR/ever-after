"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Se estiver na página de login, libera o acesso imediatamente
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.replace("/admin/login");
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, [router, pathname]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return <>{children}</>;
}