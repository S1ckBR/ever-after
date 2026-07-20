"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Gift, 
  MapPin, 
  MessageSquare, 
  Settings, 
  Users, 
  Heart 
} from "lucide-react";
import AuthGuard from "@/components/admin/AuthGuard"; // <- Importamos o seu guardião aqui

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Presentes",
      href: "/admin/presentes",
      icon: Gift,
    },
    {
      label: "Cerimônia & Festa",
      href: "/admin/evento",
      icon: MapPin,
    },
    {
      label: "Confirmações RSVP",
      href: "/admin/rsvp",
      icon: Users,
    },
    {
      label: "Mensagens",
      href: "/admin/mensagens",
      icon: MessageSquare,
    },
    {
      label: "Configurações",
      href: "/admin/configuracoes",
      icon: Settings,
    },
  ];

  return (
    // Envolvemos todo o layout no AuthGuard. Se não tiver logado, ele barra aqui!
    <AuthGuard>
      <div className="flex min-h-screen bg-[#fcfdfc]">
        <aside className="w-64 bg-white border-r border-[#e1e9dc] flex flex-col shrink-0">
          <div className="p-6 border-b border-[#f4f6f3]">
            <h1 className="font-serif text-lg text-[#3b5336] flex items-center gap-2 font-semibold">
              <Heart className="h-4 w-4 text-[#e8a3a3] fill-[#e8a3a3]" /> Painel Admin
            </h1>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-colors rounded-none ${
                    isActive
                      ? "bg-[#eef2ec] text-[#3b5336]"
                      : "text-[#607d5b] hover:bg-[#fafbfa] hover:text-[#3b5336]"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-[#3b5336]" : "text-[#8fa883]"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-[#f4f6f3]">
            <Link
              href="/"
              target="_blank"
              className="block text-center text-[10px] uppercase tracking-widest font-bold text-[#607d5b] hover:text-[#3b5336] py-2 border border-[#e1e9dc] hover:bg-[#fafbfa] transition-colors"
            >
              Visualizar Site
            </Link>
          </div>
        </aside>

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}