import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Zap, ShieldCheck, Cpu, Wrench, ArrowRight, Factory, Building2,
  Sparkles, CheckCircle2, Gauge, MapPin,
} from "lucide-react";
import heroPhoto from "@/assets/hero-eletromag.jpg.asset.json";
import logo from "@/assets/eletromag-logo.png.asset.json";
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
      {/* HERO — foto do time em campo */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroPhoto.url}
          alt="Equipe ELETROMAG operando em subestação"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/70 via-background/80 to-background" aria-hidden />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/70 to-transparent" aria-hidden />

        <div className="container-x relative flex min-h-[85vh] flex-col justify-center py-20 md:py-28">
          <img
            src={logo.url}
            alt="ELETROMAG"
            width={260}
            height={62}
            className="h-14 w-auto drop-shadow-[0_8px_30px_rgba(225,29,42,0.35)] md:h-20"
          />

          <p className="eyebrow mt-8">Engenharia elétrica · Manaus / AM</p>

          <h1 className="mt-4 max-w-3xl text-5xl font-bold leading-[1.02] md:text-7xl">
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

          <div className="mt-10 inline-flex max-w-fit items-center gap-2 rounded-full border border-white/15 bg-background/60 px-4 py-2 text-xs text-muted-foreground backdrop-blur">
            <MapPin className="h-3.5 w-3.5 text-brand-red-glow" />
            R. Kobe, 560 · Parque 10 de Novembro · Manaus – AM
          </div>

          <div className="mt-16 grid grid-cols-2 gap-6 border-t border-white/10 pt-8 md:grid-cols-4 md:max-w-3xl">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-3xl font-bold text-foreground">{s.value}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 inline-flex max-w-fit items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur">
            <div className="rounded-full bg-brand-red p-1.5"><ShieldCheck className="h-3.5 w-3.5 text-white" /></div>
            <span className="text-xs font-medium">Equipe certificada NR-10 / NR-35</span>
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
