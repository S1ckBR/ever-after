import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "As variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY não foram configuradas."
  );
}

/**
 * Cliente Supabase utilizado nos componentes executados no navegador.
 *
 * O createBrowserClient usa cookies compatíveis com SSR, permitindo que
 * o servidor e o proxy do Next.js também reconheçam a sessão autenticada.
 */
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
);