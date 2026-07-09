import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import hero from "@/assets/hero-electrician.jpg";
import panel from "@/assets/panel.jpg";
import industrial from "@/assets/industrial.jpg";

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
  { img: panel, tag: "Industrial", title: "Retrofit CCM · Metalúrgica RS", desc: "Substituição completa de quadros de comando com nova instrumentação e supervisão SCADA.", stat: "1.200 kVA" },
  { img: industrial, tag: "Infraestrutura", title: "Subestação abrigada · Planta SP", desc: "Projeto e execução de subestação abrigada 500 kVA com automação de manobra.", stat: "500 kVA" },
  { img: hero, tag: "Automação", title: "Linha de envase · Alimentícia MG", desc: "Automação de linha com CLP Siemens, IHM e integração ERP para rastreabilidade.", stat: "12 IHMs" },
  { img: panel, tag: "Predial", title: "Edifício corporativo · Curitiba", desc: "Instalação elétrica completa em 18 andares, com QGBT, no-break e SPDA classe I.", stat: "18 andares" },
  { img: industrial, tag: "Solar", title: "Usina fotovoltaica · Fazenda GO", desc: "Sistema on-grid de 320 kWp com monitoramento em nuvem e O&M mensal.", stat: "320 kWp" },
  { img: hero, tag: "Manutenção", title: "Termografia preditiva · Frigorífico PR", desc: "Contrato anual de termografia e análise de qualidade de energia em 4 unidades.", stat: "4 plantas" },
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
              <img src={p.img} alt={p.title} loading="lazy" className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-105" />
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
