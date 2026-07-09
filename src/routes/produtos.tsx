import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, Zap, Cable, Lightbulb, ShieldCheck, Cpu, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/produtos")({
  head: () => ({
    meta: [
      { title: "Produtos e Materiais Elétricos — ELETROMAG" },
      { name: "description", content: "Fornecemos disjuntores, cabos, painéis, iluminação LED e componentes das principais marcas do mercado." },
      { property: "og:title", content: "Produtos — ELETROMAG" },
      { property: "og:description", content: "Materiais elétricos de linha industrial e predial das principais marcas." },
    ],
  }),
  component: Products,
});

const categories = [
  { icon: Zap, title: "Disjuntores & Proteção", count: "120+ itens", desc: "Disjuntores DIN, caixa moldada, DPS, DR e chaves seccionadoras." },
  { icon: Cable, title: "Cabos & Condutores", count: "80+ itens", desc: "Cabos flexíveis, rígidos, HEPR, PP, controle e instrumentação." },
  { icon: Package, title: "Painéis & Quadros", count: "60+ itens", desc: "Quadros de distribuição, caixas metálicas, gabinetes IP54/IP65." },
  { icon: Lightbulb, title: "Iluminação LED", count: "150+ itens", desc: "Luminárias industriais, refletores, spots e iluminação de emergência." },
  { icon: Cpu, title: "Automação & Comando", count: "90+ itens", desc: "CLPs, IHMs, inversores, contatores, relés e botoeiras." },
  { icon: ShieldCheck, title: "Aterramento & SPDA", count: "40+ itens", desc: "Hastes, cordoalhas, captores Franklin, conectores e caixas de inspeção." },
];

const brands = ["Siemens", "Schneider", "WEG", "ABB", "Steck", "Pial", "Tramontina", "Legrand"];

function Products() {
  return (
    <>
      <section className="container-x py-20">
        <p className="eyebrow">Catálogo</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-bold md:text-6xl">
          Materiais elétricos de <span className="text-gradient-brand">linha profissional</span>.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Trabalhamos com as principais marcas do mercado. Consulte cotações
          especiais para projetos, revendas e obras de grande porte.
        </p>
      </section>

      <section className="container-x pb-16">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <article key={c.title} className="card-surface group relative overflow-hidden p-6">
              <div className="flex items-start justify-between">
                <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-3">
                  <c.icon className="h-5 w-5 text-brand-red-glow" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-red-glow">{c.count}</span>
              </div>
              <h2 className="mt-5 text-lg font-semibold">{c.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-x py-16">
        <div className="card-surface p-10">
          <p className="eyebrow">Marcas parceiras</p>
          <h2 className="mt-4 text-3xl font-bold">Fornecemos o que a engenharia pede.</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {brands.map((b) => (
              <div key={b} className="rounded-xl border border-white/10 bg-white/[0.02] p-5 text-center font-display text-lg font-semibold text-muted-foreground transition-colors hover:text-foreground">
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x pb-16">
        <div className="card-surface flex flex-col items-start gap-6 p-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Cotação para o seu projeto</h2>
            <p className="mt-2 text-muted-foreground">Envie sua lista e receba proposta em até 24h.</p>
          </div>
          <Link to="/contato" className="btn-primary"><Package className="h-4 w-4" /> Solicitar cotação <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </>
  );
}
