import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Wrench, ArrowRight, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/equipamentos")({
  head: () => ({
    meta: [
      { title: "Aluguel de Equipamentos de Engenharia Elétrica — ELETROMAG" },
      { name: "description", content: "Locação de equipamentos de medição, ensaio e manutenção elétrica: megômetro 5kV, hipot 60kV, termovisor, analisador de energia, gerador, drone e muito mais." },
      { property: "og:title", content: "Aluguel de Equipamentos — ELETROMAG" },
      { property: "og:description", content: "Equipamentos calibrados de engenharia elétrica para locação em Manaus e região." },
    ],
  }),
  component: Equipamentos,
});

function Equipamentos() {
  const { data: categorias = [] } = useQuery({
    queryKey: ["equipment_items"],
    queryFn: async () => {
      const { data, error } = await supabase.from("equipment_items").select("id, title, description").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  return (
    <>
      <section className="container-x py-20">
        <p className="eyebrow">Locação</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-bold md:text-6xl">
          Alugamos equipamentos de <span className="text-gradient-brand">engenharia elétrica</span>.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Frota calibrada e certificada de instrumentos de medição, ensaio e
          manutenção elétrica — pronta para atender obras, subestações e plantas
          industriais em Manaus e região.
        </p>
      </section>

      <section className="container-x pb-20">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categorias.map((c) => {
            const items = (c.description ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
            return (
              <article key={c.id} className="card-surface p-6">
                <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-3">
                  <Wrench className="h-5 w-5 text-brand-red-glow" />
                </div>
                <h2 className="mt-5 text-xl font-semibold">{c.title}</h2>
                <ul className="mt-5 space-y-2 border-t border-white/5 pt-4 text-sm">
                  {items.map((i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                      <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-brand-red" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <section className="container-x pb-20">
        <div className="card-surface flex flex-col items-start gap-6 p-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Precisa alugar um equipamento?</h2>
            <p className="mt-2 text-muted-foreground">Consulte disponibilidade, prazo e valores com nossa equipe.</p>
          </div>
          <Link to="/contato" className="btn-primary"><Package className="h-4 w-4" /> Solicitar locação <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </>
  );
}
