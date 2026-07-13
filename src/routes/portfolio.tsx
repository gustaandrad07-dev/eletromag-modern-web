import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PLACEHOLDER_IMG } from "@/lib/placeholder";

import heroFundo from "@/assets/hero-fundo.png.asset.json";
import empresa from "@/assets/empresa-fachada.png.asset.json";
import transformadores from "@/assets/transformadores.png.asset.json";
import poste from "@/assets/instalacao-poste.png.asset.json";
import painelDisj from "@/assets/painel-disjuntores.png.asset.json";
import painelMont from "@/assets/painel-montagem.png.asset.json";
import equipeMaior from "@/assets/equipe-maior.png.asset.json";
import painelPerigo from "@/assets/painel-disjuntores-perigo.png.asset.json";
import transformadoresInd from "@/assets/transformadores-industriais.png.asset.json";

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

const projects = [
  { img: empresa.url, caption: "Conheça nossa empresa" },
  { img: transformadores.url, caption: "Transformadores que fornecemos" },
  { img: poste.url, caption: "Instalação de postes de energia" },
  { img: painelMont.url, caption: "Montagem de painéis elétricos" },
  { img: painelDisj.url, caption: "Painéis de disjuntores e proteção" },
  { img: equipeMaior.url, caption: "Nossa equipe de especialistas" },
  { img: painelPerigo.url, caption: "Painéis de proteção e disjuntores" },
  { img: transformadoresInd.url, caption: "Transformadores de potência" },
];

function Portfolio() {
  return (
    <>
      <section className="relative isolate overflow-hidden py-20">
        <img
          src={heroFundo.url}
          alt=""
          aria-hidden
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-black/50" aria-hidden />
        <div className="container-x relative">
          <p className="eyebrow">Portfólio</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-bold md:text-6xl">
            Obras que <span className="text-gradient-brand">energizam</span> quem produz.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Uma seleção de projetos entregues pela ELETROMAG — indútria, edifícios
            corporativos, infraestrutura e geração de energia.
          </p>
        </div>
      </section>

      <section className="container-x pb-20">
        <PortfolioGrid staticProjects={projects} />
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

function PortfolioGrid({ staticProjects }: { staticProjects: { img: string; caption: string }[] }) {
  const { data: dbItems } = useQuery({
    queryKey: ["portfolio-items"],
    queryFn: async () => {
      const { data } = await supabase.from("portfolio_items").select("*").order("sort_order").order("created_at");
      return data ?? [];
    },
  });
  const all = [
    ...(dbItems ?? []).map((d) => ({ img: d.image_url, caption: d.caption })),
    ...staticProjects,
  ];
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {all.map((p, i) => (
        <article key={i} className="group relative overflow-hidden rounded-2xl border border-white/10">
          <img src={p.img} alt={p.caption} className="h-80 w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <h2 className="text-2xl font-bold">{p.caption}</h2>
          </div>
        </article>
      ))}
    </div>
  );
}

