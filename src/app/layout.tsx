import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { supabase } from "@/lib/supabase";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://www.casamentotk.com.br";
const IMAGEM_PADRAO =
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200";

export async function generateMetadata(): Promise<Metadata> {
  const { data: config } = await supabase
    .from("configuracoes")
    .select("*")
    .maybeSingle();

  const nomeNoiva = config?.nome_noiva || "Noiva";
  const nomeNoivo = config?.nome_noivo || "Noivo";
  const imagem = config?.imagem_hero || IMAGEM_PADRAO;

  const titulo = `${nomeNoiva} & ${nomeNoivo} | Nosso Casamento`;
  const descricao =
    "Você está convidado(a) para celebrar esse dia especial com a gente. Confirme sua presença e veja todos os detalhes do nosso casamento.";

  return {
    metadataBase: new URL(SITE_URL),
    title: titulo,
    description: descricao,
    openGraph: {
      title: titulo,
      description: descricao,
      url: SITE_URL,
      siteName: titulo,
      images: [
        {
          url: imagem,
          width: 1200,
          height: 630,
          alt: `${nomeNoiva} & ${nomeNoivo}`,
        },
      ],
      locale: "pt_BR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: descricao,
      images: [imagem],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}