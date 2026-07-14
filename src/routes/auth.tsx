import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LogIn, UserPlus, Zap } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acesso Admin — ELETROMAG" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await router.invalidate();
        navigate({ to: "/admin", replace: true });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        setNotice("Conta criada. Se a confirmação por e-mail estiver ativa, verifique sua caixa. Caso contrário, faça login.");
        setMode("login");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container-x flex min-h-[70vh] items-center justify-center py-16">
      <div className="card-surface w-full max-w-md p-8">
        <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-3">
          <Zap className="h-5 w-5 text-brand-red-glow" />
        </div>
        <h1 className="mt-5 text-3xl font-bold">
          {mode === "login" ? "Entrar no Admin" : "Criar conta"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Área restrita para gestão de conteúdo do site.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">E-mail</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-background/60 px-3 py-2 text-sm outline-none focus:border-brand-red"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Senha</span>
            <input
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-background/60 px-3 py-2 text-sm outline-none focus:border-brand-red"
            />
          </label>

          {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
          {notice && <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">{notice}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {mode === "login" ? <><LogIn className="h-4 w-4" /> {loading ? "Entrando..." : "Entrar"}</> : <><UserPlus className="h-4 w-4" /> {loading ? "Criando..." : "Criar conta"}</>}
          </button>
        </form>

        <button
          type="button"
          onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); setNotice(null); }}
          className="mt-6 w-full text-xs text-muted-foreground hover:text-foreground"
        >
          {mode === "login" ? "Não tem conta? Criar" : "Já tem conta? Entrar"}
        </button>
      </div>
    </section>
  );
}
