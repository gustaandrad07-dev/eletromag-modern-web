import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PLACEHOLDER_IMG } from "@/lib/placeholder";
import empresa from "@/assets/empresa-fachada.png.asset.json";
import transformadores from "@/assets/transformadores.png.asset.json";
import poste from "@/assets/instalacao-poste.png.asset.json";
import painelDisj from "@/assets/painel-disjuntores.png.asset.json";
import painelMont from "@/assets/painel-montagem.png.asset.json";

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
];

function Portfolio() {
  return (
    <>
      <section className="container-x py-20">
        <p className="eyebrow">Portfólio</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-bold md:text-6xl">
          Obras que <span className="text-gradient-brand">energizam</span> quem produz.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Uma seleção de projetos entregues pela ELETROMAG — indústria, edifícios
          corporativos, infraestrutura e geração de energia.
        </p>
      </section>

      <section className="container-x pb-20">
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
            <article key={i} className="group relative overflow-hidden rounded-2xl border border-white/10">
              <img src={p.img} alt="" aria-hidden className="h-72 w-full object-cover bg-neutral-600 transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-red-glow backdrop-blur">{p.tag}</span>
                  <span className="text-xs text-muted-foreground">{p.stat}</span>
                </div>
                <h2 className="mt-3 text-2xl font-bold">{p.title}</h2>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">{p.desc}</p>
              </div>
              <div className="absolute right-6 top-6 rounded-full border border-white/15 bg-background/60 p-2 backdrop-blur transition-transform group-hover:-translate-y-1 group-hover:translate-x-1">
                <ArrowUpRight className="h-4 w-4" />
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
