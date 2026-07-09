import { createFileRoute, Link } from "@tanstack/react-router";
import { Target, Eye, Heart, Award, Users, Clock, HardHat, Briefcase } from "lucide-react";
import industrial from "@/assets/industrial.jpg";
import dener from "@/assets/dener-aquino.png.asset.json";
import irlafe from "@/assets/irlafe-aquino.png.asset.json";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre a ELETROMAG — Engenharia Elétrica com 25+ anos de operação" },
      { name: "description", content: "Há mais de 25 anos, a ELETROMAG é referência em instalações elétricas industriais e prediais em Manaus e no Amazonas." },
      { property: "og:title", content: "Sobre — ELETROMAG" },
      { property: "og:description", content: "Nossa história, valores e a liderança por trás da ELETROMAG." },
    ],
  }),
  component: About,
});

const values = [
  { icon: Target, title: "Missão", desc: "Entregar sistemas elétricos que garantam continuidade operacional e segurança absoluta." },
  { icon: Eye, title: "Visão", desc: "Ser a referência nacional em engenharia elétrica industrial e predial de alto padrão." },
  { icon: Heart, title: "Valores", desc: "Segurança inegociável, engenharia de precisão, parceria de longo prazo com o cliente." },
];

const highlights = [
  { icon: Award, value: "25+", label: "Anos de mercado" },
  { icon: Users, value: "45", label: "Profissionais no time" },
  { icon: Clock, value: "24/7", label: "Atendimento emergencial" },
];

const leadership = [
  {
    photo: dener.url,
    name: "Dener Aquino",
    role: "Engenheiro Responsável",
    icon: HardHat,
    desc: "Responsável técnico pelos projetos e execuções da ELETROMAG, garantindo conformidade com as normas NR-10, NR-35 e ART do CREA em cada obra entregue.",
  },
  {
    photo: irlafe.url,
    name: "Antonia Aquino",
    role: "Gestora Responsável",
    icon: Briefcase,
    desc: "À frente da gestão administrativa e operacional da empresa, coordena equipes, contratos e o relacionamento com clientes corporativos e industriais.",
  },
];

function About() {
  return (
    <>
      <section className="container-x py-20">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="eyebrow">Sobre nós</p>
            <h1 className="mt-4 text-5xl font-bold md:text-6xl">
              Engenharia elétrica com <span className="text-gradient-brand">assinatura de precisão</span>.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Há mais de 25 anos, a ELETROMAG atua em obras industriais, prediais
              e infraestrutura energética — combinando engenharia rigorosa, equipe
              própria certificada e responsabilidade técnica CREA em cada projeto.
            </p>
            <p className="mt-4 text-muted-foreground">
              Nosso propósito é simples: energia que não para. Cada painel, cabo
              e conexão que instalamos é planejado para operar por décadas com
              segurança e eficiência.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-white/10">
            <img src={industrial} alt="Planta industrial atendida pela ELETROMAG" loading="lazy" className="w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="container-x py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="card-surface p-8">
              <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-3">
                <v.icon className="h-5 w-5 text-brand-red-glow" />
              </div>
              <h2 className="mt-5 text-xl font-semibold">{v.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LIDERANÇA */}
      <section className="container-x py-20">
        <div className="max-w-2xl">
          <p className="eyebrow">Liderança</p>
          <h2 className="mt-4 text-4xl font-bold md:text-5xl">
            Quem responde por <span className="text-gradient-brand">cada projeto</span>.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Uma liderança presente em campo e nos bastidores — engenharia responsável
            e gestão dedicada, lado a lado.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {leadership.map((p) => (
            <article key={p.name} className="card-surface group overflow-hidden">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-white/5">
                <img
                  src={p.photo}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-background/70 px-3 py-1 text-xs backdrop-blur">
                    <p.icon className="h-3.5 w-3.5 text-brand-red-glow" />
                    <span className="font-medium">{p.role}</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-bold">{p.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container-x py-16">
        <div className="card-surface grid gap-8 p-10 md:grid-cols-3">
          {highlights.map((h) => (
            <div key={h.label} className="flex items-center gap-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <h.icon className="h-6 w-6 text-brand-red-glow" />
              </div>
              <div>
                <div className="font-display text-3xl font-bold">{h.value}</div>
                <div className="text-sm text-muted-foreground">{h.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x pb-16">
        <div className="card-surface flex flex-col items-start gap-6 p-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Quer conhecer o time?</h2>
            <p className="mt-2 text-muted-foreground">Agende uma visita técnica ou uma reunião de escopo com nossos engenheiros.</p>
          </div>
          <Link to="/contato" className="btn-primary">Falar com o time</Link>
        </div>
      </section>
    </>
  );
}
