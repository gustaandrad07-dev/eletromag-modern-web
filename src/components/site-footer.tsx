import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import logo from "@/assets/eletromag-logo.png.asset.json";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-white/5 bg-surface/40">
      <div className="container-x grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <img src={logo.url} alt="ELETROMAG" width={160} height={38} className="h-9 w-auto" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Instalações elétricas industriais e prediais com engenharia de precisão,
            segurança certificada e energia que não para.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground">Empresa</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/sobre" className="hover:text-foreground">Sobre nós</Link></li>
            <li><Link to="/servicos" className="hover:text-foreground">Serviços</Link></li>
            <li><Link to="/portfolio" className="hover:text-foreground">Portfólio</Link></li>
            <li><Link to="/produtos" className="hover:text-foreground">Produtos</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground">Contato</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-red-glow" /> (92) 99132-7441</li>
            <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-red-glow" /> engenharia@eletromag-am.com.br</li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-red-glow" /> R. Kobe, 560 · Parque 10 de Novembro · Manaus – AM · 69054-645</li>
          </ul>

        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} ELETROMAG. Todos os direitos reservados.</p>
          <p>Energia. Precisão. Confiança.</p>
        </div>
      </div>
    </footer>
  );
}
