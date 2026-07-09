import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Clock, Zap, CheckCircle2, Phone } from "lucide-react";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Orçamento e Engenharia Elétrica · ELETROMAG" },
      { name: "description", content: "Solicite orçamento com engenheiros da ELETROMAG. Resposta em até 24 horas úteis." },
      { property: "og:title", content: "Contato — ELETROMAG" },
      { property: "og:description", content: "Fale com nosso time de engenharia. Orçamento gratuito e sem compromisso." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <section className="container-x py-20">
        <p className="eyebrow">Contato</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-bold md:text-6xl">
          Vamos energizar o <span className="text-gradient-brand">seu projeto</span>.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Preencha o formulário e um engenheiro da ELETROMAG entra em contato
          em até 24h úteis com um plano preliminar.
        </p>
      </section>

      <section className="container-x pb-24">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <form
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
              className="card-surface space-y-5 p-8"
            >
              {sent ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <div className="rounded-full bg-brand-red/15 p-4"><CheckCircle2 className="h-8 w-8 text-brand-red-glow" /></div>
                  <h2 className="mt-6 text-2xl font-bold">Solicitação recebida</h2>
                  <p className="mt-2 max-w-sm text-muted-foreground">
                    Nosso time entrará em contato em até 24h úteis. Obrigado por escolher a ELETROMAG.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Nome completo" name="nome" placeholder="Seu nome" required />
                    <Field label="Empresa" name="empresa" placeholder="Nome da empresa" />
                    <Field label="E-mail" name="email" type="email" placeholder="voce@empresa.com" required />
                    <Field label="Telefone" name="fone" placeholder="(00) 00000-0000" required />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Tipo de serviço</label>
                    <select className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-brand-red focus:ring-2 focus:ring-ring">
                      <option>Elétrica industrial</option>
                      <option>Elétrica predial</option>
                      <option>Automação</option>
                      <option>CFTV / Segurança</option>
                      <option>Energia solar</option>
                      <option>Manutenção</option>
                      <option>Outro</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Descrição do projeto</label>
                    <textarea
                      rows={5}
                      placeholder="Conte um pouco sobre a obra, prazo desejado e localização..."
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-brand-red focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full md:w-auto">
                    <Zap className="h-4 w-4" /> Enviar solicitação
                  </button>
                </>
              )}
            </form>
          </div>

          <aside className="space-y-4 lg:col-span-2">
            <InfoCard icon={Mail} label="E-mail comercial" value="engenharia@eletromag-am.com.br" note="Orçamentos e novos projetos · resposta em até 24h" />
            <InfoCard icon={MapPin} label="Endereço" value="R. Kobe, 560" note="Parque 10 de Novembro · Manaus – AM · 69054-645" />
            <InfoCard icon={Clock} label="Atendimento" value="Segunda a sexta" note="08h às 18h" />

          </aside>
        </div>
      </section>
    </>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      <input
        {...props}
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-brand-red focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

function InfoCard({ icon: Icon, label, value, note }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; note: string }) {
  return (
    <div className="card-surface flex items-start gap-4 p-6">
      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
        <Icon className="h-5 w-5 text-brand-red-glow" />
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="mt-1 font-semibold">{value}</div>
        <div className="text-xs text-muted-foreground">{note}</div>
      </div>
    </div>
  );
}
