import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import heroFundo from "@/assets/hero-fundo.png.asset.json";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfólio de Obras Elétricas — ELETROMAG" },
      { name: "description", content: "Cases de instalações elétricas industriais, prediais e projetos de automação entregues pela ELETROMAG." },
      { property: "og:title", content: "Portfólio — ELETROMAG" },
      { property: "og:description", content: "Conheça obras entregues pela ELETROMAG em indústria, comércio e infraestrutura." },
    ],
  }),
  component: Portfolio,
});

function Portfolio() {
  const { data: projects = [] } = useQuery({
    queryKey: ["portfolio_items"],
    queryFn: async () => {
      const { data, error } = await supabase.from("portfolio_items").select("id, image_url, caption").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  return (
    <>
      <section className="relative isolate overflow-hidden py-20">
        <img src={heroFundo.url} alt="" aria-hidden className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-black/50" aria-hidden />
        <div className="container-x relative">
          <p className="eyebrow">Portfólio</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-bold md:text-6xl">
            Obras que <span className="text-gradient-brand">energizam</span> quem produz.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Uma seleção de projetos entregues pela ELETROMAG — indústria, edifícios
            corporativos, infraestrutura e geração de energia.
          </p>
        </div>
      </section>

      <section className="container-x pb-20">
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((p) => (
            <article key={p.id} className="group relative overflow-hidden rounded-2xl border border-white/10">
              <img src={p.image_url} alt={p.caption} className="h-80 w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h2 className="text-2xl font-bold">{p.caption}</h2>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container-x pb-16">
        <div className="card-surface flex flex-col items-start gap-6 p-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Sua obra na próxima edição?</h2>
            <p className="mt-2 text-muted-foreground">Vamos conversar sobre o seu projeto.</p>
          </div>
          <Link to="/contato" className="btn-primary">Iniciar projeto</Link>
        </div>
      </section>
    </>
  );
}
