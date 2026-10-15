This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Checkout InfinitePay

O checkout mantém o Mercado Pago e apresenta uma tela para o convidado escolher o provedor. Antes de habilitar a InfinitePay em produção:

1. Configure no ambiente de servidor da Vercel (Production e Preview, conforme necessário):
   - `SUPABASE_SERVICE_ROLE_KEY`: chave secreta de servidor do projeto Supabase `ever-after`. **Nunca use o prefixo `NEXT_PUBLIC_` para esta chave.**
   - `INFINITEPAY_HANDLE`: sua InfiniteTag da InfinitePay, sem o símbolo `$`.
   - `NEXT_PUBLIC_APP_URL`: URL pública canônica do site, incluindo `https://`.
2. Habilite o Checkout Integrado na conta InfinitePay.
3. Aplique a migration `supabase/migrations/20261015000000_infinitepay_checkout.sql` no projeto Supabase de produção.
4. Faça um pagamento de teste e confirme que o pedido aparece em `presentes_recebidos` e que `presentes.cotas_compradas` aumenta apenas após a confirmação pela API da InfinitePay.

O webhook em `/api/webhooks/infinitepay` consulta `payment_check` antes de registrar o pagamento. A migration cria uma tabela privada de pedidos pendentes e funções transacionais para reservar cotas e evitar registro duplicado. Não marque pedidos como pagos manualmente só porque o navegador retornou ao site.
