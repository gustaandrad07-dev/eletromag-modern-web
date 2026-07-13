import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Área do administrador — ELETROMAG" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Conta criada! Entrando...");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/admin" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container-x flex min-h-[70vh] items-center justify-center py-20">
      <div className="card-surface w-full max-w-md p-8">
        <p className="eyebrow">Painel administrativo</p>
        <h1 className="mt-3 text-3xl font-bold">
          {mode === "login" ? "Entrar" : "Criar conta"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "login"
            ? "Acesse para gerenciar o conteúdo do site."
            : "Primeiro acesso? Crie sua conta com o email cadastrado como administrador."}
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-brand-red"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Senha</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-brand-red"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? "..." : mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode((m) => (m === "login" ? "signup" : "login"))}
          className="mt-4 text-xs text-muted-foreground hover:text-foreground"
        >
          {mode === "login" ? "Primeiro acesso? Criar conta" : "Já tem conta? Entrar"}
        </button>
      </div>
    </section>
  );
}
