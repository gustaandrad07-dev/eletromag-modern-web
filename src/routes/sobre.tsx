import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getIcon } from "@/lib/icon-map";
import equipe from "@/assets/equipe-eletromag.png.asset.json";
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

type Hero = { eyebrow: string; title_pre: string; title_highlight: string; paragraph_1: string; paragraph_2: string; image_url: string };
type ValueItem = { icon: string; title: string; desc: string };
type Highlight = { icon: string; value: string; label: string };
type Leader = { icon: string; name: string; role: string; desc: string; photo_url: string };
type Cta = { title: string; desc: string; button_label: string };

const DEFAULTS = {
  about_hero: {
    eyebrow: "Sobre nós",
    title_pre: "Engenharia elétrica com",
    title_highlight: "assinatura de precisão",
    paragraph_1: "Há mais de 25 anos, a ELETROMAG atua em obras industriais, prediais e infraestrutura energética — combinando engenharia rigorosa, equipe própria certificada e responsabilidade técnica CREA em cada projeto.",
    paragraph_2: "Nosso propósito é simples: energia que não para. Cada painel, cabo e conexão que instalamos é planejado para operar por décadas com segurança e eficiência.",
    image_url: equipe.url,
  } satisfies Hero,
  about_values: [
    { icon: "Target", title: "Missão", desc: "Entregar sistemas elétricos que garantam continuidade operacional e segurança absoluta." },
    { icon: "Eye", title: "Visão", desc: "Ser a referência nacional em engenharia elétrica industrial e predial de alto padrão." },
    { icon: "Heart", title: "Valores", desc: "Segurança inegociável, engenharia de precisão, parceria de longo prazo com o cliente." },
  ] satisfies ValueItem[],
  about_highlights: [
    { icon: "Award", value: "25+", label: "Anos de mercado" },
    { icon: "Users", value: "70", label: "Profissionais no time" },
    { icon: "Clock", value: "24/7", label: "Atendimento emergencial" },
  ] satisfies Highlight[],
  about_leadership: [
    { icon: "HardHat", name: "Dener Aquino", role: "Engenheiro Responsável", desc: "Responsável técnico pelos projetos e execuções da ELETROMAG, garantindo conformidade com as normas NR-10, NR-35 e ART do CREA em cada obra entregue.", photo_url: dener.url },
    { icon: "Briefcase", name: "Antonia Aquino", role: "Gestora Responsável", desc: "À frente da gestão administrativa e operacional da empresa, coordena equipes, contratos e o relacionamento com clientes corporativos e industriais.", photo_url: irlafe.url },
  ] satisfies Leader[],
  about_cta: { title: "Quer conhecer o time?", desc: "Agende uma visita técnica ou uma reunião de escopo com nossos engenheiros.", button_label: "Falar com o time" } satisfies Cta,
};

function useAbout() {
  return useQuery({
    queryKey: ["site_content", "about"],
    queryFn: async () => {
      const keys = Object.keys(DEFAULTS);
      const { data, error } = await supabase.from("site_content").select("key, value").in("key", keys);
      if (error) throw error;
      const map = new Map((data ?? []).map((r) => [r.key, r.value as unknown]));
      return {
        hero: (map.get("about_hero") as Hero) ?? DEFAULTS.about_hero,
        values: (map.get("about_values") as ValueItem[]) ?? DEFAULTS.about_values,
        highlights: (map.get("about_highlights") as Highlight[]) ?? DEFAULTS.about_highlights,
        leadership: (map.get("about_leadership") as Leader[]) ?? DEFAULTS.about_leadership,
        cta: (map.get("about_cta") as Cta) ?? DEFAULTS.about_cta,
      };
    },
  });
}

function About() {
  const { data } = useAbout();
  const hero = data?.hero ?? DEFAULTS.about_hero;
  const values = data?.values ?? DEFAULTS.about_values;
  const highlights = data?.highlights ?? DEFAULTS.about_highlights;
  const leadership = data?.leadership ?? DEFAULTS.about_leadership;
  const cta = data?.cta ?? DEFAULTS.about_cta;

  return (
    <>
      <section className="container-x py-20">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="eyebrow">{hero.eyebrow}</p>
            <h1 className="mt-4 text-5xl font-bold md:text-6xl">
              {hero.title_pre} <span className="text-gradient-brand">{hero.title_highlight}</span>.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">{hero.paragraph_1}</p>
            <p className="mt-4 text-muted-foreground">{hero.paragraph_2}</p>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-white/10">
            <img src={hero.image_url} alt="Equipe ELETROMAG em campo" className="aspect-[4/3] w-full object-cover bg-neutral-600" />
          </div>
        </div>
      </section>

      <section className="container-x py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {values.map((v) => {
            const Icon = getIcon(v.icon);
            return (
              <div key={v.title} className="card-surface p-8">
                <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-3">
                  <Icon className="h-5 w-5 text-brand-red-glow" />
                </div>
                <h2 className="mt-5 text-xl font-semibold">{v.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="container-x py-20">
        <div className="max-w-2xl">
          <p className="eyebrow">Liderança</p>
          <h2 className="mt-4 text-4xl font-bold md:text-5xl">
            Quem responde por <span className="text-gradient-brand">cada projeto</span>.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Uma liderança presente em campo e nos bastidores — engenharia responsável e gestão dedicada, lado a lado.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {leadership.map((p) => {
            const Icon = getIcon(p.icon);
            return (
              <article key={p.name} className="card-surface group overflow-hidden">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-white/5">
                  <img src={p.photo_url} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-background/70 px-3 py-1 text-xs backdrop-blur">
                      <Icon className="h-3.5 w-3.5 text-brand-red-glow" />
                      <span className="font-medium">{p.role}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold">{p.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="container-x py-16">
        <div className="card-surface grid gap-8 p-10 md:grid-cols-3">
          {highlights.map((h) => {
            const Icon = getIcon(h.icon);
            return (
              <div key={h.label} className="flex items-center gap-4">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <Icon className="h-6 w-6 text-brand-red-glow" />
                </div>
                <div>
                  <div className="font-display text-3xl font-bold">{h.value}</div>
                  <div className="text-sm text-muted-foreground">{h.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="container-x pb-16">
        <div className="card-surface flex flex-col items-start gap-6 p-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">{cta.title}</h2>
            <p className="mt-2 text-muted-foreground">{cta.desc}</p>
          </div>
          <Link to="/contato" className="btn-primary">{cta.button_label}</Link>
        </div>
      </section>
    </>
  );
}
