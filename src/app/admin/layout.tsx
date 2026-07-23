"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  ExternalLink,
  Gift,
  Heart,
  LayoutDashboard,
  MapPin,
  Menu,
  MessageSquare,
  Settings,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import AuthGuard from "@/components/admin/AuthGuard";

const menuItems = [
  {
    label: "Dashboard",
    descricao: "Visão geral",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Presentes",
    descricao: "Lista e cotas",
    href: "/admin/presentes",
    icon: Gift,
  },
  {
    label: "Cerimônia & Festa",
    descricao: "Locais e horários",
    href: "/admin/evento",
    icon: MapPin,
  },
  {
    label: "Confirmações RSVP",
    descricao: "Lista de convidados",
    href: "/admin/rsvp",
    icon: Users,
  },
  {
    label: "Mensagens",
    descricao: "Mural de recados",
    href: "/admin/mensagens",
    icon: MessageSquare,
  },
  {
    label: "Configurações",
    descricao: "Conteúdo do site",
    href: "/admin/configuracoes",
    icon: Settings,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    setMenuAberto(false);
  }, [pathname]);

  const itemAtivo =
    menuItems.find((item) =>
      item.href === "/admin"
        ? pathname === "/admin"
        : pathname.startsWith(item.href)
    ) ?? menuItems[0];

  const verificarAtivo = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const SidebarContent = () => (
    <>
      {/* Identidade */}
      <div className="border-b border-white/10 px-6 pb-6 pt-7">
        <div className="mb-5 flex items-center justify-between">
          <Link href="/admin" className="group flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[#d5bd84]/45 bg-white/[0.05]">
              <span className="font-serif text-sm tracking-[0.12em] text-[#f7ead0]">
                T<span className="text-[#d3b36b]">&amp;</span>K
              </span>
            </div>

            <div>
              <span className="block text-[9px] font-semibold uppercase tracking-[0.22em] text-[#d3b36b]">
                Tayná &amp; Kaique
              </span>
              <h1 className="mt-1 font-serif text-lg text-[#f4efe5]">
                Painel dos Noivos
              </h1>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setMenuAberto(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-[#d8e0d4] transition-colors hover:bg-white/10 lg:hidden"
            aria-label="Fechar menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#d3b36b]" />
          <p className="text-[10px] leading-relaxed text-[#d8e0d4]/75">
            Gerencie todos os detalhes do grande dia.
          </p>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 overflow-y-auto px-4 py-5">
        <span className="mb-3 block px-3 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#aebcab]/55">
          Menu principal
        </span>

        <div className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = verificarAtivo(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-300",
                  isActive
                    ? "bg-[#f7f3eb] text-[#334a35] shadow-[0_10px_24px_rgba(0,0,0,0.12)]"
                    : "text-[#d8e0d4]/75 hover:bg-white/[0.06] hover:text-[#f4efe5]",
                ].join(" ")}
              >
                {isActive && (
                  <span className="absolute -left-1 h-7 w-1 rounded-full bg-[#d3b36b]" />
                )}

                <div
                  className={[
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                    isActive
                      ? "bg-[#e3eadf] text-[#556f51]"
                      : "bg-white/[0.05] text-[#aebcab] group-hover:bg-white/[0.09]",
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <span className="block truncate text-[11px] font-semibold uppercase tracking-[0.09em]">
                    {item.label}
                  </span>
                  <span
                    className={[
                      "mt-0.5 block truncate text-[9px]",
                      isActive
                        ? "text-[#6f7e6b]"
                        : "text-[#aebcab]/50",
                    ].join(" ")}
                  >
                    {item.descricao}
                  </span>
                </div>

                <ChevronRight
                  className={[
                    "h-3.5 w-3.5 transition-transform",
                    isActive
                      ? "translate-x-0 text-[#9b7a38]"
                      : "-translate-x-1 text-white/20 group-hover:translate-x-0",
                  ].join(" ")}
                />
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Visualizar site */}
      <div className="border-t border-white/10 p-4">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl border border-[#d3b36b]/35 bg-[#d3b36b]/10 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#f7ead0] transition-all duration-300 hover:border-[#d3b36b]/60 hover:bg-[#d3b36b]/15"
        >
          Visualizar site
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>

        <p className="mt-4 text-center font-serif text-[10px] italic text-[#aebcab]/45">
          21 · Novembro · 2026
        </p>
      </div>
    </>
  );

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#f5f2ec]">
        {/* Overlay mobile */}
        {menuAberto && (
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setMenuAberto(false)}
            className="fixed inset-0 z-40 bg-[#1f2f21]/55 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* Sidebar desktop */}
        <aside className="fixed inset-y-0 left-0 z-50 hidden w-[286px] flex-col overflow-hidden bg-[#334a35] shadow-[18px_0_45px_rgba(38,55,40,0.10)] lg:flex">
          <SidebarContent />
        </aside>

        {/* Sidebar mobile */}
        <aside
          className={[
            "fixed inset-y-0 left-0 z-50 flex w-[286px] flex-col overflow-hidden bg-[#334a35] shadow-2xl transition-transform duration-300 lg:hidden",
            menuAberto ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          <SidebarContent />
        </aside>

        <div className="lg:pl-[286px]">
          {/* Cabeçalho */}
          <header className="sticky top-0 z-30 border-b border-[#e4dccd]/90 bg-[#f9f7f2]/90 backdrop-blur-xl">
            <div className="flex h-[76px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMenuAberto(true)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#ddd3c1] bg-white text-[#52654f] shadow-sm transition-colors hover:bg-[#f2f5ef] lg:hidden"
                  aria-label="Abrir menu"
                >
                  <Menu className="h-5 w-5" />
                </button>

                <div className="min-w-0">
                  <span className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9b7a38]">
                    Painel administrativo
                  </span>
                  <h2 className="mt-1 truncate font-serif text-xl text-[#395138] sm:text-2xl">
                    {itemAtivo.label}
                  </h2>
                </div>
              </div>

              <div className="hidden items-center gap-3 sm:flex">
                <div className="text-right">
                  <span className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8a9586]">
                    Casamento
                  </span>
                  <span className="mt-0.5 block font-serif text-xs text-[#52654f]">
                    Tayná &amp; Kaique
                  </span>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d8c99f] bg-[#f2e8d2]">
                  <Heart className="h-4 w-4 fill-[#a78036] text-[#a78036]" />
                </div>
              </div>
            </div>
          </header>

          {/* Conteúdo */}
          <main className="min-h-[calc(100vh-76px)] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
            <div className="mx-auto max-w-[1400px]">{children}</div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
