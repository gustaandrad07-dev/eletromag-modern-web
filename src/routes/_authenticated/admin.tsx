import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LogOut, Trash2, Upload, Plus, Save, ShieldCheck } from "lucide-react";
import { useIsAdmin } from "@/lib/admin-hooks";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Painel Admin — ELETROMAG" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type Tab = "conteudo" | "portfolio" | "equipamentos" | "admins";

function AdminPage() {
  const navigate = useNavigate();
  const { data: isAdmin, isLoading } = useIsAdmin();
  const [tab, setTab] = useState<Tab>("conteudo");

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  if (isLoading) {
    return <div className="container-x py-20 text-muted-foreground">Carregando...</div>;
  }
  if (!isAdmin) {
    return (
      <div className="container-x py-20">
        <div className="card-surface p-8">
          <h1 className="text-2xl font-bold">Sem permissão</h1>
          <p className="mt-2 text-muted-foreground">
            Sua conta está autenticada mas não tem papel de administrador. Peça a um admin para conceder o acesso.
          </p>
          <button onClick={signOut} className="btn-ghost mt-6"><LogOut className="h-4 w-4" /> Sair</button>
        </div>
      </div>
    );
  }

  return (
    <section className="container-x py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow"><ShieldCheck className="h-3 w-3" /> Painel administrativo</p>
          <h1 className="mt-2 text-3xl font-bold">Gerenciar site</h1>
        </div>
        <button onClick={signOut} className="btn-ghost"><LogOut className="h-4 w-4" /> Sair</button>
      </div>

      <div className="mt-8 flex flex-wrap gap-1 border-b border-white/10">
        {[
          { id: "conteudo", label: "Conteúdo & Contato" },
          { id: "portfolio", label: "Portfólio" },
          { id: "equipamentos", label: "Equipamentos" },
          { id: "admins", label: "Administradores" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as Tab)}
            className={`px-4 py-2.5 text-sm transition-colors ${
              tab === t.id ? "border-b-2 border-brand-red text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "conteudo" && <ContentTab />}
        {tab === "portfolio" && <PortfolioTab />}
        {tab === "equipamentos" && <EquipmentTab />}
        {tab === "admins" && <AdminsTab />}
      </div>
    </section>
  );
}

/* ---------- CONTENT / CONTACT TAB ---------- */
function ContentTab() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ContentEditor
        title="Informações de Contato"
        contentKey="contact_info"
        fields={[
          { key: "phone", label: "Telefone" },
          { key: "email", label: "E-mail" },
          { key: "address", label: "Endereço" },
          { key: "hours_weekdays", label: "Horário Seg-Sex" },
          { key: "hours_saturday", label: "Horário Sábado" },
        ]}
      />
      <ContentEditor
        title="Página Inicial (Hero)"
        contentKey="home_hero"
        fields={[
          { key: "eyebrow", label: "Eyebrow (cabeçalho pequeno)" },
          { key: "title", label: "Título principal" },
          { key: "subtitle", label: "Subtítulo", textarea: true },
        ]}
      />
      <ContentEditor
        title="Página Sobre"
        contentKey="about_page"
        fields={[
          { key: "title", label: "Título" },
          { key: "intro", label: "Texto de introdução", textarea: true },
        ]}
      />
    </div>
  );
}

function ContentEditor({
  title,
  contentKey,
  fields,
}: {
  title: string;
  contentKey: string;
  fields: { key: string; label: string; textarea?: boolean }[];
}) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-content", contentKey],
    queryFn: async () => {
      const { data } = await supabase.from("site_content").select("value").eq("key", contentKey).maybeSingle();
      return (data?.value as Record<string, string>) ?? {};
    },
  });
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) setValues(data);
  }, [data]);

  async function save() {
    setSaving(true);
    const { error } = await supabase
      .from("site_content")
      .upsert({ key: contentKey, value: values, updated_at: new Date().toISOString() }, { onConflict: "key" });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Salvo!");
    qc.invalidateQueries({ queryKey: ["site-content", contentKey] });
  }

  if (isLoading) return <div className="card-surface p-6 text-sm text-muted-foreground">Carregando...</div>;

  return (
    <div className="card-surface p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-4 space-y-3">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">{f.label}</label>
            {f.textarea ? (
              <textarea
                value={values[f.key] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                rows={3}
                className="mt-1 w-full rounded-lg border border-white/10 bg-background/60 px-3 py-2 text-sm outline-none focus:border-brand-red"
              />
            ) : (
              <input
                value={values[f.key] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-white/10 bg-background/60 px-3 py-2 text-sm outline-none focus:border-brand-red"
              />
            )}
          </div>
        ))}
      </div>
      <button onClick={save} disabled={saving} className="btn-primary mt-4">
        <Save className="h-4 w-4" /> {saving ? "Salvando..." : "Salvar"}
      </button>
    </div>
  );
}

/* ---------- PORTFOLIO TAB ---------- */
function PortfolioTab() {
  const qc = useQueryClient();
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: items } = useQuery({
    queryKey: ["admin-portfolio"],
    queryFn: async () => {
      const { data } = await supabase.from("portfolio_items").select("*").order("sort_order").order("created_at");
      return data ?? [];
    },
  });

  async function upload() {
    if (!file || !caption.trim()) return toast.error("Escolha uma imagem e escreva a legenda");
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `portfolio/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("site-images").upload(path, file);
      if (upErr) throw upErr;
      const { data: signed, error: sErr } = await supabase.storage
        .from("site-images")
        .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
      if (sErr) throw sErr;
      const { error: insErr } = await supabase
        .from("portfolio_items")
        .insert({ image_url: signed.signedUrl, caption, sort_order: (items?.length ?? 0) + 1 });
      if (insErr) throw insErr;
      toast.success("Imagem adicionada!");
      setCaption("");
      setFile(null);
      qc.invalidateQueries({ queryKey: ["admin-portfolio"] });
      qc.invalidateQueries({ queryKey: ["portfolio-items"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro no upload");
    } finally {
      setUploading(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Excluir esta imagem?")) return;
    const { error } = await supabase.from("portfolio_items").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin-portfolio"] });
    qc.invalidateQueries({ queryKey: ["portfolio-items"] });
  }

  return (
    <div className="space-y-6">
      <div className="card-surface p-6">
        <h2 className="text-lg font-semibold">Adicionar imagem ao portfólio</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
          <input
            placeholder="Legenda"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="rounded-lg border border-white/10 bg-background/60 px-3 py-2 text-sm outline-none focus:border-brand-red"
          />
        </div>
        <button onClick={upload} disabled={uploading} className="btn-primary mt-4">
          <Upload className="h-4 w-4" /> {uploading ? "Enviando..." : "Enviar imagem"}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items?.map((it) => (
          <div key={it.id} className="card-surface overflow-hidden">
            <img src={it.image_url} alt={it.caption} className="h-48 w-full object-cover" />
            <div className="flex items-center justify-between p-4">
              <span className="text-sm">{it.caption}</span>
              <button onClick={() => remove(it.id)} className="text-brand-red-glow hover:text-brand-red">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- EQUIPMENT TAB ---------- */
function EquipmentTab() {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { data: items } = useQuery({
    queryKey: ["admin-equipment"],
    queryFn: async () => {
      const { data } = await supabase.from("equipment_items").select("*").order("sort_order").order("created_at");
      return data ?? [];
    },
  });

  async function add() {
    if (!title.trim()) return;
    const { error } = await supabase
      .from("equipment_items")
      .insert({ title, description, sort_order: (items?.length ?? 0) + 1 });
    if (error) return toast.error(error.message);
    setTitle("");
    setDescription("");
    qc.invalidateQueries({ queryKey: ["admin-equipment"] });
    qc.invalidateQueries({ queryKey: ["equipment-items"] });
  }

  async function remove(id: string) {
    if (!confirm("Excluir?")) return;
    await supabase.from("equipment_items").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-equipment"] });
    qc.invalidateQueries({ queryKey: ["equipment-items"] });
  }

  return (
    <div className="space-y-6">
      <div className="card-surface p-6">
        <h2 className="text-lg font-semibold">Adicionar equipamento</h2>
        <div className="mt-4 space-y-3">
          <input
            placeholder="Título (ex: Megômetro 5kV)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-background/60 px-3 py-2 text-sm outline-none focus:border-brand-red"
          />
          <textarea
            placeholder="Descrição (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-white/10 bg-background/60 px-3 py-2 text-sm outline-none focus:border-brand-red"
          />
          <button onClick={add} className="btn-primary"><Plus className="h-4 w-4" /> Adicionar</button>
        </div>
      </div>
      <div className="grid gap-3">
        {items?.map((it) => (
          <div key={it.id} className="card-surface flex items-start justify-between gap-4 p-4">
            <div>
              <div className="font-semibold">{it.title}</div>
              {it.description && <div className="mt-1 text-sm text-muted-foreground">{it.description}</div>}
            </div>
            <button onClick={() => remove(it.id)} className="text-brand-red-glow hover:text-brand-red">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- ADMINS TAB ---------- */
function AdminsTab() {
  const qc = useQueryClient();
  const [email, setEmail] = useState("");
  const { data: admins } = useQuery({
    queryKey: ["admin-list"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("list_admin_users");
      if (error) throw error;
      return data ?? [];
    },
  });

  async function grant() {
    if (!email.trim()) return;
    const { data, error } = await supabase.rpc("grant_admin_by_email", { _email: email });
    if (error) return toast.error(error.message);
    if (data === "not_found") return toast.error("Usuário não encontrado. Peça para se cadastrar primeiro em /auth.");
    toast.success("Admin adicionado!");
    setEmail("");
    qc.invalidateQueries({ queryKey: ["admin-list"] });
  }

  async function revoke(userId: string) {
    if (!confirm("Remover permissão de admin?")) return;
    const { error } = await supabase.rpc("revoke_admin", { _user_id: userId });
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin-list"] });
  }

  return (
    <div className="space-y-6">
      <div className="card-surface p-6">
        <h2 className="text-lg font-semibold">Adicionar administrador</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          O usuário precisa se cadastrar primeiro em /auth. Depois adicione o email aqui.
        </p>
        <div className="mt-4 flex gap-2">
          <input
            type="email"
            placeholder="email@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-lg border border-white/10 bg-background/60 px-3 py-2 text-sm outline-none focus:border-brand-red"
          />
          <button onClick={grant} className="btn-primary"><Plus className="h-4 w-4" /> Adicionar</button>
        </div>
      </div>
      <div className="grid gap-2">
        {admins?.map((a: { user_id: string; email: string }) => (
          <div key={a.user_id} className="card-surface flex items-center justify-between p-4">
            <div className="text-sm">{a.email}</div>
            <button onClick={() => revoke(a.user_id)} className="text-brand-red-glow hover:text-brand-red">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
