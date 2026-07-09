import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import logo from "@/assets/eletromag-logo.png.asset.json";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow justify-center">Erro 404</p>
        <h1 className="mt-4 text-6xl font-bold text-gradient-brand">Sem energia aqui</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-8">
          <Link to="/" className="btn-primary">Voltar ao início</Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Curto-circuito detectado
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Algo deu errado. Tente novamente ou volte para a página inicial.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="btn-primary">
            Tentar de novo
          </button>
          <a href="/" className="btn-ghost">Ir para o início</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ELETROMAG — Instalações Elétricas Industriais e Prediais" },
      {
        name: "description",
        content:
          "ELETROMAG: serviços de engenharia elétrica com precisão, segurança e energia contínua para indústrias, comércios e obras.",
      },
      { name: "author", content: "ELETROMAG" },
      { property: "og:title", content: "ELETROMAG — Instalações Elétricas Industriais e Prediais" },
      {
        property: "og:description",
        content:
          "ELETROMAG: serviços de engenharia elétrica com precisão, segurança e energia contínua para indústrias, comércios e obras.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "ELETROMAG — Instalações Elétricas Industriais e Prediais" },
      { name: "twitter:description", content: "ELETROMAG: serviços de engenharia elétrica com precisão, segurança e energia contínua para indústrias, comércios e obras." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9c494a54-255c-471d-8f21-b8e0e2b5a10f/id-preview-3164819d--f65deaea-8ee2-40b3-9b3e-435b09b0d874.lovable.app-1783610361216.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9c494a54-255c-471d-8f21-b8e0e2b5a10f/id-preview-3164819d--f65deaea-8ee2-40b3-9b3e-435b09b0d874.lovable.app-1783610361216.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: logo.url },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </QueryClientProvider>
  );
}
