import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Factory, Building2, Cpu, Wrench, Zap, Lightbulb, ShieldCheck, Battery,
  Activity, Cable, ArrowRight, HardHat,
} from "lucide-react";

export const Route = createFileRoute("/servicos")({
  head: () => ({
    meta: [
      { title: "Serviços Elétricos Industriais e Prediais — ELETROMAG" },
      { name: "description", content: "Instalação elétrica industrial, predial, automação, CFTV, SPDA e manutenção com equipe certificada NR-10." },
      { property: "og:title", content: "Serviços — ELETROMAG" },
      { property: "og:description", content: "Do painel industrial ao CFTV: engenharia elétrica completa." },
    ],
  }),
  component: Services,
});

const services = [
  { icon: Factory, title: "Elétrica Industrial", desc: "Montagem de painéis, quadros de comando, barramentos, subestações e alimentação de máquinas.", items: ["Painéis CCM e QGBT", "Instalação de motores", "Aterramento industrial", "Retrofit de plantas"] },
  { icon: Building2, title: "Elétrica Predial e Comercial", desc: "Projetos e execução em edifícios, condomínios, lojas e escritórios com padrão de acabamento.", items: ["Entrada de energia", "Circuitos e tomadas", "Iluminação profissional", "Adequação NBR 5410"] },
  { icon: Cpu, title: "Automação Industrial", desc: "Programação de CLPs, IHMs, inversores e sistemas SCADA para linhas de produção.", items: ["CLP Siemens / Allen-Bradley", "Inversores de frequência", "Supervisórios", "Retrofit de comando"] },
  { icon: HardHat, title: "Manutenção Preventiva de Subestação", desc: "Inspeções, ensaios elétricos e manutenção completa em subestações de média e alta tensão.", items: ["Termografia em barramentos", "Ensaios em transformadores", "Limpeza e reaperto", "Relatório técnico com ART"] },
  { icon: Activity, title: "Ensaio de EPCs e EPIs", desc: "Testes elétricos e certificação de equipamentos de proteção coletiva e individual conforme NR-10.", items: ["Ensaio dielétrico", "Vara de manobra", "Luvas isolantes", "Aterramento temporário"] },
  { icon: ShieldCheck, title: "SPDA & Aterramento", desc: "Sistemas de proteção contra descargas atmosféricas e malhas de aterramento certificadas.", items: ["Projeto NBR 5419", "Medição ôhmica", "Malha de terra", "DPS e equipotencialização"] },
  { icon: Battery, title: "Energia Solar Fotovoltaica", desc: "Projeto e instalação de sistemas on-grid residenciais, comerciais e industriais.", items: ["Dimensionamento", "Homologação junto à concessionária", "Monitoramento em nuvem", "O&M anual"] },
  { icon: Lightbulb, title: "Iluminação Técnica", desc: "Projetos luminotécnicos com cálculo de lux e eficiência energética.", items: ["LED industrial", "Iluminação de emergência", "Lighting design", "Retrofit LED"] },
  { icon: Cable, title: "Infraestrutura & Cabeamento", desc: "Eletrocalhas, leitos, cabeamento estruturado e infraestrutura de dados.", items: ["Cat6 / Cat6A", "Fibra óptica", "Data center", "Rack e patch panel"] },
  { icon: Wrench, title: "Manutenção Preventiva", desc: "Contratos mensais e trimestrais com relatórios técnicos e atendimento emergencial 24h.", items: ["Termografia", "Análise de qualidade de energia", "Plantão 24h", "Relatórios técnicos"] },
];

function Services() {
  return (
    <>
      <section className="container-x py-20">
        <p className="eyebrow">Serviços</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-bold md:text-6xl">
          Toda a cadeia elétrica <span className="text-gradient-brand">sob um único CNPJ</span>.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Projeto, execução, comissionamento e manutenção — com equipe própria,
          certificação NR-10 e responsabilidade técnica CREA.
        </p>
      </section>

      <section className="container-x pb-20">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <article key={s.title} className="card-surface p-6">
              <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-3">
                <s.icon className="h-5 w-5 text-brand-red-glow" />
              </div>
              <h2 className="mt-5 text-xl font-semibold">{s.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              <ul className="mt-5 space-y-1.5 border-t border-white/5 pt-4 text-sm">
                {s.items.map((i) => (
                  <li key={i} className="flex items-center gap-2 text-muted-foreground">
                    <span className="h-1 w-1 rounded-full bg-brand-red" /> {i}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="container-x pb-20">
        <div className="card-surface flex flex-col items-start gap-6 p-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Precisa de um serviço específico?</h2>
            <p className="mt-2 text-muted-foreground">Nosso engenheiro liga em até 24h úteis para entender seu projeto.</p>
          </div>
          <Link to="/contato" className="btn-primary"><Zap className="h-4 w-4" /> Solicitar orçamento <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </>
  );
}
