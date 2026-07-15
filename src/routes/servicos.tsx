import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Zap, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getIcon } from "@/lib/icon-map";

export const Route = createFileRoute("/servicos")({
  head: () => ({
    meta: [
      { title: "Serviços Elétricos Industriais e Prediais — ELETROMAG" },
      { name: "description", content: "Instalação elétrica industrial, predial, automação, CFTV, SPDA e manutenção com equipe certificada NR-10." },
      { property: "og:title", content: "Serviços — ELETROMAG" },
      { property: "og:description", content: "Do painel industrial ao CFTV: engenharia elétrica completa." },
    ],
  }),
  component: Services,
});

function Services() {
  const { data: services = [] } = useQuery({
    queryKey: ["service_items"],
    queryFn: async () => {
      const { data, error } = await supabase.from("service_items").select("*").order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <>
      <section className="container-x py-20">
        <p className="eyebrow">Serviços</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-bold md:text-6xl">
          Toda a cadeia elétrica <span className="text-gradient-brand">sob engenharia certificada</span>.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Projeto, execução, comissionamento e manutenção — com equipe própria,
          certificação NR-10 e responsabilidade técnica CREA.
        </p>
      </section>

      <section className="container-x pb-20">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const Icon = getIcon(s.icon);
            const items = (s.items ?? "").split("\n").map((i) => i.trim()).filter(Boolean);
            return (
              <article key={s.id} className="card-surface p-6">
                <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-3">
                  <Icon className="h-5 w-5 text-brand-red-glow" />
                </div>
                <h2 className="mt-5 text-xl font-semibold">{s.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                {items.length > 0 && (
                  <ul className="mt-5 space-y-1.5 border-t border-white/5 pt-4 text-sm">
                    {items.map((i) => (
                      <li key={i} className="flex items-center gap-2 text-muted-foreground">
                        <span className="h-1 w-1 rounded-full bg-brand-red" /> {i}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="container-x pb-20">
        <div className="card-surface flex flex-col items-start gap-6 p-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Precisa de um serviço específico?</h2>
            <p className="mt-2 text-muted-foreground">Nosso engenheiro liga em até 24h úteis para entender seu projeto.</p>
          </div>
          <Link to="/contato" className="btn-primary"><Zap className="h-4 w-4" /> Solicitar orçamento <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </>
  );
}
