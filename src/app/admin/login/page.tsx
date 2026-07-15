"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Clique no botão confirmado! Iniciando login...");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Erro do Supabase:", error);
        alert("Erro ao entrar: " + error.message);
        setLoading(false);
      } else {
        console.log("Login sucesso, forçando redirecionamento...");
        // Forçamos o reload completo para garantir que o middleware leia o cookie de sessão
        window.location.href = "/admin/configuracoes";
      }
    } catch (err) {
      console.error("Erro inesperado:", err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfdfc] p-4">
      <Card className="w-full max-w-sm rounded-none border-[#e1e9dc] shadow-sm">
        <CardHeader className="border-b border-[#f4f6f3] pb-4 text-center">
          <CardTitle className="font-serif text-[#3b5336] flex items-center justify-center gap-2">
            <Lock className="h-5 w-5" /> Acesso Administrativo
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Formulário com onSubmit direto */}
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="email" 
              placeholder="E-mail" 
              className="w-full border border-[#e1e9dc] p-3 text-sm focus:outline-none focus:border-[#3b5336]" 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
            <input 
              type="password" 
              placeholder="Senha" 
              className="w-full border border-[#e1e9dc] p-3 text-sm focus:outline-none focus:border-[#3b5336]" 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
            {/* Botão HTML nativo para garantir o funcionamento */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#3b5336] hover:bg-[#4e6b48] text-white rounded-none uppercase text-xs tracking-widest font-semibold py-4 transition-colors"
            >
              {loading ? "Entrando..." : "ENTRAR"}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}