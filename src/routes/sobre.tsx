import { createFileRoute, Link } from "@tanstack/react-router";
import { Target, Eye, Heart, Award, Users, Clock } from "lucide-react";
import industrial from "@/assets/industrial.jpg";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre a ELETROMAG — Engenharia Elétrica com 15 anos de operação" },
      { name: "description", content: "Fundada em 2009, a ELETROMAG é referência em instalações elétricas industriais e prediais no Brasil." },
      { property: "og:title", content: "Sobre — ELETROMAG" },
      { property: "og:description", content: "Nossa história, valores e o time de engenharia por trás da ELETROMAG." },
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
  { icon: Award, value: "15+", label: "Anos de mercado" },
  { icon: Users, value: "45", label: "Profissionais no time" },
  { icon: Clock, value: "24/7", label: "Atendimento emergencial" },
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
              Desde 2009, a ELETROMAG atua em obras industriais, prediais e
              infraestrutura energética — combinando engenharia rigorosa, equipe
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
