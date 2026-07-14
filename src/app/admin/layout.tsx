"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Gift, Settings, Calendar, Heart, Users, MessageSquare } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Presentes", href: "/admin/presentes", icon: Gift },
    { name: "Cerimônia & Festa", href: "/admin/evento", icon: Calendar },
    { name: "Mensagens", href: "/admin/mensagens", icon: MessageSquare },
    { name: "Configurações", href: "/admin/configuracoes", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8faf6]">
      {/* Sidebar Lateral */}
      <aside className="hidden md:flex w-64 flex-col border-r border-[#e1e9dc] bg-white">
        <div className="flex h-16 items-center px-6 border-b border-[#e1e9dc]">
          <span className="font-serif text-lg tracking-wider font-semibold text-[#3b5336] flex items-center gap-2">
            <Heart className="h-4 w-4 fill-current" /> Painel Admin
          </span>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-none ${
                  isActive
                    ? "bg-[#e2ebd9] text-[#3b5336]"
                    : "text-[#607d5b] hover:bg-[#f4f6f3] hover:text-[#3b5336]"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[#e1e9dc]">
          <Link 
            href="/" 
            className="block text-center text-xs uppercase tracking-widest text-[#607d5b] hover:text-[#3b5336] font-semibold py-2 bg-[#f4f6f3]"
          >
            Visualizar Site
          </Link>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-[#e1e9dc] bg-white px-6 md:px-8">
          <h1 className="text-sm uppercase tracking-widest font-semibold text-[#3b5336]">
            Visão Geral do Evento
          </h1>
          <div className="flex items-center gap-2 text-xs text-[#607d5b]">
            Logado como <strong className="text-[#3b5336]">Administrador</strong>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}