import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Clock, Phone } from "lucide-react";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Orçamento e Engenharia Elétrica · ELETROMAG" },
      { name: "description", content: "Fale com a ELETROMAG pelo WhatsApp e solicite seu orçamento em minutos." },
      { property: "og:title", content: "Contato — ELETROMAG" },
      { property: "og:description", content: "Fale com nosso time de engenharia pelo WhatsApp." },
    ],
  }),
  component: Contact,
});

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.134 1.585 5.929L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

const WHATSAPP_URL = "https://wa.me/92981096674?text=Olá+vim+pelo+site+e+gostaria+de+um+orçamento";

function Contact() {
  return (
    <>
      <section className="container-x py-20">
        <p className="eyebrow">Contato</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-bold md:text-6xl">
          Vamos energizar o <span className="text-gradient-brand">seu projeto</span>.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Fale direto com nosso time pelo WhatsApp — atendimento rápido e orçamento sem compromisso.
        </p>
      </section>

      <section className="container-x pb-24">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="card-surface flex flex-col items-center justify-center gap-6 p-12 text-center">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Falar no WhatsApp"
                className="group flex h-32 w-32 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_40px_rgba(37,211,102,0.4)] transition-transform hover:scale-105"
              >
                <WhatsAppIcon className="h-16 w-16" />
              </a>
              <div>
                <h2 className="text-2xl font-bold">Fale conosco no WhatsApp</h2>
                <p className="mt-2 text-muted-foreground">Clique no ícone acima e envie sua mensagem.</p>
              </div>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <WhatsAppIcon className="h-4 w-4" /> Abrir conversa
              </a>
            </div>
          </div>

          <aside className="space-y-4 lg:col-span-2">
            <InfoCard icon={Phone} label="Telefone" value="(92) 99132-7441" note="WhatsApp e chamadas · resposta em até 24h" />
            <InfoCard icon={Mail} label="E-mail comercial" value="engenharia@eletromag-am.com.br" note="Orçamentos e novos projetos · resposta em até 24h" />
            <InfoCard icon={MapPin} label="Endereço" value="R. Kobe, 560" note="Parque 10 de Novembro · Manaus – AM · 69054-645" />
            <InfoCard icon={Clock} label="Atendimento" value="Segunda a sexta" note="08h às 17h · Sábado 08h às 12h" />
          </aside>
        </div>
      </section>
    </>
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
