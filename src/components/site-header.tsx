import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Zap, ShieldCheck } from "lucide-react";
import logo from "@/assets/eletromag-logo.png.asset.json";
import { useIsAdmin } from "@/lib/admin-hooks";


const nav = [
  { to: "/", label: "Início" },
  { to: "/servicos", label: "Serviços" },
  { to: "/equipamentos", label: "Equipamentos" },
  { to: "/portfolio", label: "Portfólio" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { data: isAdmin } = useIsAdmin();

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-xl">
      <div className="container-x flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <img src={logo.url} alt="ELETROMAG" width={140} height={32} className="h-8 w-auto" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground bg-white/5" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isAdmin && (
            <Link to="/admin" className="btn-ghost !py-2">
              <ShieldCheck className="h-4 w-4" /> Admin
            </Link>
          )}
          <Link to="/contato" className="btn-primary">
            <Zap className="h-4 w-4" /> Orçamento
          </Link>
        </div>


        <button
          className="btn-ghost md:hidden !p-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/5 bg-background/95 md:hidden">
          <div className="container-x flex flex-col gap-1 py-4">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
                activeProps={{ className: "text-foreground bg-white/5" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
            <Link to="/contato" className="btn-primary mt-2" onClick={() => setOpen(false)}>
              <Zap className="h-4 w-4" /> Solicitar orçamento
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
