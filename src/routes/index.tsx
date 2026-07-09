import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Zap, ShieldCheck, Cpu, Wrench, ArrowRight, Factory, Building2,
  Sparkles, CheckCircle2, Gauge, MapPin, Phone,
} from "lucide-react";
import painelMontagem from "@/assets/painel-montagem.png.asset.json";
import heroFundo from "@/assets/hero-fundo.png.asset.json";
import { PLACEHOLDER_IMG } from "@/lib/placeholder";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.134 1.585 5.929L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

export const Route = createFileRoute("/")({
  component: Home,
});

const services = [
  { icon: Factory, title: "Elétrica Industrial", desc: "Painéis, quadros de comando, aterramento e infraestrutura para plantas produtivas." },
  { icon: Building2, title: "Elétrica Predial", desc: "Instalações completas em edifícios comerciais, condomínios e obras corporativas." },
  { icon: Cpu, title: "Automação Industrial", desc: "Sistemas de automação, controle e supervisão com CLPs, IHMs e integração de plantas." },
  { icon: Wrench, title: "Manutenção Preventiva", desc: "Contratos de manutenção com equipe 24h para eliminar paradas não programadas." },
];

const stats = [
  { value: "25+", label: "Anos de operação" },
  { value: "1000+", label: "Obras entregues" },
  { value: "24/7", label: "Suporte técnico" },
  { value: "100%", label: "Normas NR-10" },
];

function Home() {
  return (
    <>
      {/* HERO — foto do time em campo */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroFundo.url}
          alt=""
          aria-hidden
          className="absolute inset-0 -z-10 h-full w-full object-cover blur-sm"
        />
        <div className="absolute inset-0 -z-10 bg-black/50" aria-hidden />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/60 via-background/80 to-background" aria-hidden />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/60 to-transparent" aria-hidden />

        <div className="container-x relative flex min-h-[85vh] flex-col justify-center py-20 md:py-28">
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
            <a
              href="https://api.whatsapp.com/send?phone=5592981096674&text=Olá+vim+pelo+site+e+gostaria+de+um+orçamento"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <WhatsAppIcon className="h-4 w-4" /> Faça seu orçamento
            </a>
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
            <img src={painelMontagem.url} alt="Equipe ELETROMAG montando painel elétrico" width={1200} height={900} className="w-full aspect-[4/3] object-cover" />
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
          <img src={PLACEHOLDER_IMG} alt="" aria-hidden width={1600} height={900} className="absolute inset-0 h-full w-full object-cover opacity-40 bg-neutral-600" />
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
