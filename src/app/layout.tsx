import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { SkipLink } from "@/components/ui/SkipLink";

/**
 * Nunito auto-hospedada (OFL): sem requisição a servidores externos,
 * com `display: swap` e preload automático feito pelo next/font.
 */
const nunito = localFont({
  src: [
    { path: "./fonts/nunito-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/nunito-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/nunito-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "./fonts/nunito-latin-800-normal.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-nunito",
  display: "swap",
  fallback: ["system-ui", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: {
    default: "Lacrei Saúde | Cuidado inclusivo para a comunidade LGBTQIAPN+",
    template: "%s | Lacrei Saúde",
  },
  description:
    "Encontre profissionais de saúde comprometidos com o atendimento inclusivo, seguro e acolhedor da comunidade LGBTQIAPN+.",
  applicationName: "Lacrei Saúde",
  openGraph: {
    title: "Lacrei Saúde",
    description: "Cuidado em saúde com respeito e segurança para a comunidade LGBTQIAPN+.",
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#018762",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={nunito.variable}>
      <body>
        <Providers>
          <SkipLink targetId="conteudo" />
          <Header />
          <main id="conteudo">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
