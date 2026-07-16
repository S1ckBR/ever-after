import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import Story from "@/components/public/Story";
import Details from "@/components/public/Details";
import Gifts from "@/components/public/Gifts";
import RsvpForm from "@/components/public/RsvpForm";
import Mural from "@/components/public/Mural";
import Footer from "@/components/public/Footer";
import { supabase } from "@/lib/supabase";

export const revalidate = 0;

async function getCasamentoData() {
  const { data: config } = await supabase
    .from("configuracoes")
    .select("*")
    .maybeSingle();

  const { data: presentes } = await supabase
    .from("presentes")
    .select("*")
    .order("created_at", { ascending: true });

  return { 
    config: config || {}, 
    presentes: presentes || [] 
  };
}

export default async function Home() {
  const { config, presentes } = await getCasamentoData();

  const themeStyles = {
    "--color-primary": config.cor_principal || "#3b5336",
    "--color-secondary": config.cor_secundaria || "#fdfcf9",
    "--color-buttons": config.cor_botoes || "#3b5336",
  } as React.CSSProperties;

  return (
    <div className="min-h-screen" style={themeStyles}>
      <Navbar />
      <main>
        <Hero 
          nomeNoiva={config.nome_noiva} 
          nomeNoivo={config.nome_noivo} 
          dataCasamento={config.data_casamento} 
          imagemHero={config.imagem_hero} 
        />
        <Story config={config} />
        <Details config={config} />
        <Gifts presentesIniciais={presentes} />
        <div id="rsvp">
          <RsvpForm dataLimiteRsvp={config.data_limite_rsvp} />
        </div>
        <Mural />
        <Footer />
      </main>
    </div>
  );
}