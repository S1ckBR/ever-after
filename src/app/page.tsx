import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import Story from "@/components/public/Story";
import Details from "@/components/public/Details";
import Gifts from "@/components/public/Gifts";
import RsvpForm from "@/components/public/RsvpForm";
import Mural from "@/components/public/Mural";
import Footer from "@/components/public/Footer";
import { supabase } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const revalidate = 0;

async function getCasamentoData() {
  const { data: config } = await getSupabaseAdmin()
    .from("configuracoes")
    .select("id, nome_noiva, nome_noivo, data_casamento, cor_principal, cor_secundaria, cor_botoes, imagem_hero, texto_historia, imagem_historia_1, imagem_historia_2, data_limite_rsvp, titulo_cerimonial, subtitulo_cerimonial, imagem_cerimonia, cerimonia_data, cerimonia_hora, hora_cerimonia, cerimonia_local, local_cerimonia, cerimonia_mapa_url, imagem_recepcao, festa_data, festa_hora, hora_recepcao, festa_local, local_recepcao, festa_mapa_url")
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