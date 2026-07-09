import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Zap, ShieldCheck, Cpu, Wrench, ArrowRight, Factory, Building2,
  Sparkles, CheckCircle2, Gauge,
} from "lucide-react";
import hero from "@/assets/hero-electrician.jpg";
import panel from "@/assets/panel.jpg";
import industrial from "@/assets/industrial.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

const services = [
  { icon: Factory, title: "Elétrica Industrial", desc: "Painéis, quadros de comando, aterramento e infraestrutura para plantas produtivas." },
  { icon: Building2, title: "Elétrica Predial", desc: "Instalações completas em edifícios comerciais, condomínios e obras corporativas." },
  { icon: Cpu, title: "Automação & CFTV", desc: "Sistemas de automação, controle e monitoramento com integração inteligente." },
  { icon: Wrench, title: "Manutenção Preventiva", desc: "Contratos de manutenção com equipe 24h para eliminar paradas não programadas." },
];

const stats = [
  { value: "15+", label: "Anos de operação" },
  { value: "480", label: "Obras entregues" },
  { value: "24/7", label: "Suporte técnico" },
  { value: "100%", label: "Normas NR-10" },
];

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-40" aria-hidden />
        <div className="container-x relative grid gap-12 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-7">
            <p className="eyebrow">Engenharia elétrica · desde 2009</p>
            <h1 className="mt-6 text-5xl font-bold leading-[1.02] md:text-7xl">
              Energia que <span className="text-gradient-brand">não para</span>.
              <br />Precisão que se vê.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              A ELETROMAG projeta, instala e mantém sistemas elétricos industriais
              e prediais com padrão de engenharia certificada — do primeiro cabo
              ao último painel energizado.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contato" className="btn-primary">
                <Zap className="h-4 w-4" /> Solicitar orçamento
              </Link>
              <Link to="/servicos" className="btn-ghost">
                Ver serviços <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-6 border-t border-white/5 pt-8 md:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="font-display text-3xl font-bold text-foreground">{s.value}</div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative md:col-span-5">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-panel">
              <img
                src={hero}
                alt="Eletricista da ELETROMAG trabalhando em painel industrial"
                width={1600}
                height={1100}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 to-transparent p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-brand-red p-2"><ShieldCheck className="h-4 w-4 text-white" /></div>
                  <div>
                    <p className="text-sm font-semibold">Equipe certificada NR-10 / NR-35</p>
                    <p className="text-xs text-muted-foreground">Segurança auditada em cada obra</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -right-4 -top-4 hidden rounded-2xl border border-white/10 bg-surface/90 p-4 backdrop-blur md:block">
              <div className="flex items-center gap-2 text-xs">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                Rede energizada · 3ph 380V
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="container-x py-20">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">O que fazemos</p>
            <h2 className="mt-4 max-w-2xl text-4xl font-bold md:text-5xl">
              Serviços elétricos completos, sob engenharia.
            </h2>
          </div>
          <Link to="/servicos" className="btn-ghost self-start md:self-auto">
            Todos os serviços <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div key={s.title} className="card-surface group relative overflow-hidden p-6 transition-transform hover:-translate-y-1">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-red/10 blur-2xl transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-3">
                  <s.icon className="h-5 w-5 text-brand-red-glow" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SPLIT FEATURE */}
      <section className="container-x py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="relative overflow-hidden rounded-2xl border border-white/10">
            <img src={panel} alt="Painel elétrico industrial instalado pela ELETROMAG" width={1200} height={900} loading="lazy" className="w-full object-cover" />
          </div>
          <div>
            <p className="eyebrow">Metodologia</p>
            <h2 className="mt-4 text-4xl font-bold md:text-5xl">Da planta ao painel energizado.</h2>
            <p className="mt-4 text-muted-foreground">
              Cada projeto passa por um processo de engenharia auditável — do
              levantamento em campo à comissionamento final, com documentação
              técnica completa.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Levantamento técnico e projeto executivo",
                "Dimensionamento de cargas e curto-circuito",
                "Execução com equipe própria certificada",
                "Comissionamento e as-built assinados",
              ].map((i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-red-glow" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link to="/sobre" className="btn-ghost">Conheça a ELETROMAG <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* BIG BANNER CTA */}
      <section className="container-x py-16">
        <div className="relative overflow-hidden rounded-3xl border border-white/10">
          <img src={industrial} alt="Planta industrial atendida pela ELETROMAG" width={1600} height={900} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent" />
          <div className="relative grid gap-8 p-10 md:grid-cols-2 md:p-16">
            <div>
              <p className="eyebrow">Pronto para começar</p>
              <h2 className="mt-4 text-4xl font-bold md:text-5xl">
                Seu próximo projeto elétrico começa com um <span className="text-gradient-brand">diagnóstico gratuito</span>.
              </h2>
            </div>
            <div className="flex flex-col justify-end gap-4">
              <p className="text-muted-foreground">
                Nosso time de engenharia avalia sua planta ou obra sem custo e apresenta
                um plano com escopo, prazo e investimento estimado.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/contato" className="btn-primary"><Sparkles className="h-4 w-4" /> Falar com engenheiro</Link>
                <Link to="/portfolio" className="btn-ghost"><Gauge className="h-4 w-4" /> Ver obras</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
