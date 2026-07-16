import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Image as ImageIcon, Package, FileText, Trash2, Plus, Save, Upload, RefreshCw, ShieldCheck, UserCheck, UserX } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Painel Admin — ELETROMAG" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

type Tab = "portfolio" | "equipment" | "services" | "about" | "content";
type PortfolioItem = { id: string; image_url: string; caption: string; sort_order: number };
type EquipmentItem = { id: string; title: string; description: string | null; sort_order: number };
type ContentRow = { key: string; value: Record<string, unknown> };

const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24 * 365 * 10; // 10 years

function AdminPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("portfolio");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      setEmail(u.user?.email ?? "");
      if (!u.user) return;
      const { data } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
      setIsAdmin(Boolean(data));
    })();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (isAdmin === null) return <div className="container-x py-16"><p className="text-muted-foreground">Carregando...</p></div>;
  if (!isAdmin) {
    return (
      <section className="container-x py-16">
        <div className="card-surface p-8">
          <h1 className="text-2xl font-bold">Sem permissão</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sua conta ({email}) não tem papel de administrador. Peça a um admin existente para conceder acesso.</p>
          <button onClick={handleSignOut} className="btn-ghost mt-6"><LogOut className="h-4 w-4" /> Sair</button>
        </div>
      </section>
    );
  }

  return (
    <section className="container-x py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">Painel de conteúdo</h1>
          <p className="mt-1 text-sm text-muted-foreground">Logado como {email}</p>
        </div>
        <button onClick={handleSignOut} className="btn-ghost"><LogOut className="h-4 w-4" /> Sair</button>
      </div>

      <div className="mt-8 flex flex-wrap gap-2 border-b border-white/10">
        <TabButton active={tab === "portfolio"} onClick={() => setTab("portfolio")} icon={ImageIcon} label="Portfólio" />
        <TabButton active={tab === "equipment"} onClick={() => setTab("equipment")} icon={Package} label="Equipamentos" />
        <TabButton active={tab === "services"} onClick={() => setTab("services")} icon={Package} label="Serviços" />
        <TabButton active={tab === "about"} onClick={() => setTab("about")} icon={FileText} label="Sobre" />
        <TabButton active={tab === "content"} onClick={() => setTab("content")} icon={FileText} label="Textos do site" />
      </div>

      <div className="mt-8">
        {tab === "portfolio" && <PortfolioAdmin />}
        {tab === "equipment" && <EquipmentAdmin />}
        {tab === "services" && <ServicesAdmin />}
        {tab === "about" && <AboutAdmin />}
        {tab === "content" && <ContentAdmin />}
      </div>
    </section>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm transition-colors ${active ? "border-brand-red text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
    >
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}

/* ============ PORTFOLIO ============ */

function PortfolioAdmin() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("portfolio_items").select("*").order("sort_order");
    if (error) setError(error.message); else setItems(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { reload(); }, [reload]);

  async function addItem() {
    const nextOrder = (items[items.length - 1]?.sort_order ?? 0) + 10;
    const { error } = await supabase.from("portfolio_items").insert({
      image_url: "https://via.placeholder.com/800x600.png?text=Nova+imagem",
      caption: "Novo item",
      sort_order: nextOrder,
    });
    if (error) setError(error.message); else reload();
  }

  if (loading) return <p className="text-muted-foreground">Carregando...</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{items.length} itens</p>
        <button onClick={addItem} className="btn-primary"><Plus className="h-4 w-4" /> Adicionar item</button>
      </div>
      {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <PortfolioCard key={item.id} item={item} onChange={reload} />
        ))}
      </div>
    </div>
  );
}

function PortfolioCard({ item, onChange }: { item: PortfolioItem; onChange: () => void }) {
  const [caption, setCaption] = useState(item.caption);
  const [sortOrder, setSortOrder] = useState(item.sort_order);
  const [imageUrl, setImageUrl] = useState(item.image_url);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMsg(null);
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `portfolio/${Date.now()}-${safeName}`;
      const up = await supabase.storage.from("site-images").upload(path, file, { contentType: file.type, upsert: false });
      if (up.error) throw up.error;
      const signed = await supabase.storage.from("site-images").createSignedUrl(path, SIGNED_URL_TTL_SECONDS);
      if (signed.error) throw signed.error;
      setImageUrl(signed.data.signedUrl);
      const upd = await supabase.from("portfolio_items").update({ image_url: signed.data.signedUrl }).eq("id", item.id);
      if (upd.error) throw upd.error;
      setMsg("Imagem enviada.");
      onChange();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Falha no upload");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function save() {
    setSaving(true);
    const { error } = await supabase.from("portfolio_items").update({ caption, sort_order: sortOrder, image_url: imageUrl }).eq("id", item.id);
    setSaving(false);
    if (error) setMsg(error.message); else { setMsg("Salvo."); onChange(); }
  }

  async function remove() {
    if (!confirm("Excluir este item do portfólio?")) return;
    const { error } = await supabase.from("portfolio_items").delete().eq("id", item.id);
    if (error) setMsg(error.message); else onChange();
  }

  return (
    <article className="card-surface p-4">
      <div className="relative aspect-video overflow-hidden rounded-lg border border-white/10 bg-black/40">
        {imageUrl && <img src={imageUrl} alt={caption} className="h-full w-full object-cover" />}
      </div>
      <div className="mt-3 space-y-3">
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Legenda</span>
          <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-background/60 px-3 py-2 text-sm outline-none focus:border-brand-red" />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">URL da imagem</span>
          <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-background/60 px-3 py-2 text-xs outline-none focus:border-brand-red" />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Ordem</span>
          <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className="mt-1 w-32 rounded-lg border border-white/10 bg-background/60 px-3 py-2 text-sm outline-none focus:border-brand-red" />
        </label>

        <div className="flex flex-wrap gap-2 pt-2">
          <label className="btn-ghost cursor-pointer">
            <Upload className="h-4 w-4" /> {uploading ? "Enviando..." : "Trocar imagem (PNG/JPG)"}
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
          <button onClick={save} disabled={saving} className="btn-primary"><Save className="h-4 w-4" /> {saving ? "Salvando..." : "Salvar"}</button>
          <button onClick={remove} className="btn-ghost text-red-300"><Trash2 className="h-4 w-4" /> Excluir</button>
        </div>
        {msg && <p className="text-xs text-muted-foreground">{msg}</p>}
      </div>
    </article>
  );
}

/* ============ EQUIPMENT ============ */

function EquipmentAdmin() {
  const [items, setItems] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("equipment_items").select("*").order("sort_order");
    if (error) setError(error.message); else setItems(data ?? []);
    setLoading(false);
  }, []);
  useEffect(() => { reload(); }, [reload]);

  async function addItem() {
    const nextOrder = (items[items.length - 1]?.sort_order ?? 0) + 10;
    const { error } = await supabase.from("equipment_items").insert({ title: "Nova categoria", description: "", sort_order: nextOrder });
    if (error) setError(error.message); else reload();
  }

  if (loading) return <p className="text-muted-foreground">Carregando...</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{items.length} categorias · Uma linha por equipamento na descrição.</p>
        <button onClick={addItem} className="btn-primary"><Plus className="h-4 w-4" /> Adicionar</button>
      </div>
      {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
      <div className="space-y-4">
        {items.map((item) => <EquipmentCard key={item.id} item={item} onChange={reload} />)}
      </div>
    </div>
  );
}

function EquipmentCard({ item, onChange }: { item: EquipmentItem; onChange: () => void }) {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description ?? "");
  const [sortOrder, setSortOrder] = useState(item.sort_order);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    const { error } = await supabase.from("equipment_items").update({ title, description, sort_order: sortOrder }).eq("id", item.id);
    setSaving(false);
    if (error) setMsg(error.message); else { setMsg("Salvo."); onChange(); }
  }
  async function remove() {
    if (!confirm("Excluir esta categoria?")) return;
    const { error } = await supabase.from("equipment_items").delete().eq("id", item.id);
    if (error) setMsg(error.message); else onChange();
  }

  return (
    <article className="card-surface p-5">
      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        <div className="space-y-3">
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Título</span>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-background/60 px-3 py-2 text-sm outline-none focus:border-brand-red" />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Descrição (um item por linha)</span>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={8} className="mt-1 w-full rounded-lg border border-white/10 bg-background/60 px-3 py-2 text-sm outline-none focus:border-brand-red" />
          </label>
        </div>
        <div className="space-y-3">
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Ordem</span>
            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className="mt-1 w-24 rounded-lg border border-white/10 bg-background/60 px-3 py-2 text-sm outline-none focus:border-brand-red" />
          </label>
          <button onClick={save} disabled={saving} className="btn-primary w-full"><Save className="h-4 w-4" /> {saving ? "..." : "Salvar"}</button>
          <button onClick={remove} className="btn-ghost w-full text-red-300"><Trash2 className="h-4 w-4" /> Excluir</button>
        </div>
      </div>
      {msg && <p className="mt-3 text-xs text-muted-foreground">{msg}</p>}
    </article>
  );
}

/* ============ SITE CONTENT ============ */

const CONTENT_TEMPLATES: Record<string, Record<string, unknown>> = {
  home_hero: { eyebrow: "Engenharia elétrica · Manaus / AM", title: "Energia com precisão", subtitle: "Instalações elétricas industriais e prediais em Manaus" },
  about_page: { title: "Sobre a ELETROMAG", intro: "Somos especialistas em engenharia elétrica com mais de 70 profissionais no time." },
  contact_info: { phone: "(92) 991327441", email: "engenharia@eletromag.com.br", address: "Manaus / AM", hours_weekdays: "Segunda a Sexta: 8h às 17h", hours_saturday: "Sábado: 8h às 12h" },
};

function ContentAdmin() {
  const [rows, setRows] = useState<ContentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("site_content").select("key, value").order("key");
    if (error) setError(error.message); else setRows((data ?? []) as ContentRow[]);
    setLoading(false);
  }, []);
  useEffect(() => { reload(); }, [reload]);

  async function addKey(key: string) {
    const template = CONTENT_TEMPLATES[key] ?? {};
    const { error } = await supabase.from("site_content").insert({ key, value: template as never });
    if (error) setError(error.message); else reload();
  }

  if (loading) return <p className="text-muted-foreground">Carregando...</p>;

  const existing = new Set(rows.map((r) => r.key));
  const missing = Object.keys(CONTENT_TEMPLATES).filter((k) => !existing.has(k));

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Edite os campos de texto de cada seção. Salve para publicar.</p>
      {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
      {missing.length > 0 && (
        <div className="card-surface p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Criar chave padrão</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {missing.map((k) => (
              <button key={k} onClick={() => addKey(k)} className="btn-ghost text-xs"><Plus className="h-3 w-3" /> {k}</button>
            ))}
          </div>
        </div>
      )}
      <div className="space-y-4">
        {rows.map((r) => <ContentCard key={r.key} row={r} onChange={reload} />)}
      </div>
    </div>
  );
}

function ContentCard({ row, onChange }: { row: ContentRow; onChange: () => void }) {
  const [fields, setFields] = useState<Record<string, string>>(() => {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(row.value ?? {})) out[k] = typeof v === "string" ? v : JSON.stringify(v);
    return out;
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    const { error } = await supabase.from("site_content").update({ value: fields as never, updated_at: new Date().toISOString() }).eq("key", row.key);
    setSaving(false);
    if (error) setMsg(error.message); else { setMsg("Salvo."); onChange(); }
  }

  return (
    <article className="card-surface p-5">
      <h3 className="font-mono text-sm text-brand-red-glow">{row.key}</h3>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {Object.entries(fields).map(([k, v]) => (
          <label key={k} className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">{k}</span>
            {v.length > 60 ? (
              <textarea value={v} onChange={(e) => setFields({ ...fields, [k]: e.target.value })} rows={3} className="mt-1 w-full rounded-lg border border-white/10 bg-background/60 px-3 py-2 text-sm outline-none focus:border-brand-red" />
            ) : (
              <input type="text" value={v} onChange={(e) => setFields({ ...fields, [k]: e.target.value })} className="mt-1 w-full rounded-lg border border-white/10 bg-background/60 px-3 py-2 text-sm outline-none focus:border-brand-red" />
            )}
          </label>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button onClick={save} disabled={saving} className="btn-primary"><Save className="h-4 w-4" /> {saving ? "..." : "Salvar"}</button>
        <button onClick={onChange} className="btn-ghost"><RefreshCw className="h-4 w-4" /> Recarregar</button>
        {msg && <p className="text-xs text-muted-foreground">{msg}</p>}
      </div>
    </article>
  );
}

/* ============ SERVICES ============ */

type ServiceItem = { id: string; icon: string; title: string; description: string; items: string; sort_order: number };

function ServicesAdmin() {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("service_items").select("*").order("sort_order");
    if (error) setError(error.message); else setItems((data ?? []) as ServiceItem[]);
    setLoading(false);
  }, []);
  useEffect(() => { reload(); }, [reload]);

  async function addItem() {
    const nextOrder = (items[items.length - 1]?.sort_order ?? 0) + 10;
    const { error } = await supabase.from("service_items").insert({ icon: "Zap", title: "Novo serviço", description: "", items: "", sort_order: nextOrder });
    if (error) setError(error.message); else reload();
  }

  if (loading) return <p className="text-muted-foreground">Carregando...</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{items.length} serviços · Uma linha por item na lista.</p>
        <button onClick={addItem} className="btn-primary"><Plus className="h-4 w-4" /> Adicionar serviço</button>
      </div>
      {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
      <div className="space-y-4">
        {items.map((item) => <ServiceCard key={item.id} item={item} onChange={reload} />)}
      </div>
    </div>
  );
}

function ServiceCard({ item, onChange }: { item: ServiceItem; onChange: () => void }) {
  const [icon, setIcon] = useState(item.icon);
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description ?? "");
  const [listItems, setListItems] = useState(item.items ?? "");
  const [sortOrder, setSortOrder] = useState(item.sort_order);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    const { error } = await supabase.from("service_items").update({ icon, title, description, items: listItems, sort_order: sortOrder }).eq("id", item.id);
    setSaving(false);
    if (error) setMsg(error.message); else { setMsg("Salvo."); onChange(); }
  }
  async function remove() {
    if (!confirm("Excluir este serviço?")) return;
    const { error } = await supabase.from("service_items").delete().eq("id", item.id);
    if (error) setMsg(error.message); else onChange();
  }

  return (
    <article className="card-surface p-5">
      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-[160px_1fr]">
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Ícone</span>
              <IconPicker value={icon} onChange={setIcon} />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Título</span>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-background/60 px-3 py-2 text-sm outline-none focus:border-brand-red" />
            </label>
          </div>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Descrição</span>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="mt-1 w-full rounded-lg border border-white/10 bg-background/60 px-3 py-2 text-sm outline-none focus:border-brand-red" />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Itens da lista (um por linha)</span>
            <textarea value={listItems} onChange={(e) => setListItems(e.target.value)} rows={5} className="mt-1 w-full rounded-lg border border-white/10 bg-background/60 px-3 py-2 text-sm outline-none focus:border-brand-red" />
          </label>
        </div>
        <div className="space-y-3">
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Ordem</span>
            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className="mt-1 w-24 rounded-lg border border-white/10 bg-background/60 px-3 py-2 text-sm outline-none focus:border-brand-red" />
          </label>
          <button onClick={save} disabled={saving} className="btn-primary w-full"><Save className="h-4 w-4" /> {saving ? "..." : "Salvar"}</button>
          <button onClick={remove} className="btn-ghost w-full text-red-300"><Trash2 className="h-4 w-4" /> Excluir</button>
        </div>
      </div>
      {msg && <p className="mt-3 text-xs text-muted-foreground">{msg}</p>}
    </article>
  );
}

function IconPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  // Static list keeps this SSR-safe and typecheck friendly.
  const options = ["Factory","Building2","Cpu","Wrench","Zap","Lightbulb","ShieldCheck","Battery","Activity","Cable","HardHat","Target","Eye","Heart","Award","Users","Clock","Briefcase","Star","Settings","Sun","Plug","Bolt","Gauge","Cog","Power"];
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-background/60 px-3 py-2 text-sm outline-none focus:border-brand-red">
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

/* ============ ABOUT ============ */

type AboutHero = { eyebrow: string; title_pre: string; title_highlight: string; paragraph_1: string; paragraph_2: string; image_url: string };
type AboutValue = { icon: string; title: string; desc: string };
type AboutHighlight = { icon: string; value: string; label: string };
type AboutLeader = { icon: string; name: string; role: string; desc: string; photo_url: string };
type AboutCta = { title: string; desc: string; button_label: string };

const ABOUT_DEFAULTS = {
  about_hero: { eyebrow: "Sobre nós", title_pre: "Engenharia elétrica com", title_highlight: "assinatura de precisão", paragraph_1: "", paragraph_2: "", image_url: "" } as AboutHero,
  about_values: [] as AboutValue[],
  about_highlights: [] as AboutHighlight[],
  about_leadership: [] as AboutLeader[],
  about_cta: { title: "Quer conhecer o time?", desc: "", button_label: "Falar com o time" } as AboutCta,
};

async function uploadImage(file: File, folder: string): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${folder}/${Date.now()}-${safeName}`;
  const up = await supabase.storage.from("site-images").upload(path, file, { contentType: file.type, upsert: false });
  if (up.error) throw up.error;
  const signed = await supabase.storage.from("site-images").createSignedUrl(path, SIGNED_URL_TTL_SECONDS);
  if (signed.error) throw signed.error;
  return signed.data.signedUrl;
}

async function saveContent(key: string, value: unknown) {
  const { error } = await supabase.from("site_content").upsert({ key, value: value as never, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) throw error;
}

function AboutAdmin() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hero, setHero] = useState<AboutHero>(ABOUT_DEFAULTS.about_hero);
  const [values, setValues] = useState<AboutValue[]>(ABOUT_DEFAULTS.about_values);
  const [highlights, setHighlights] = useState<AboutHighlight[]>(ABOUT_DEFAULTS.about_highlights);
  const [leadership, setLeadership] = useState<AboutLeader[]>(ABOUT_DEFAULTS.about_leadership);
  const [cta, setCta] = useState<AboutCta>(ABOUT_DEFAULTS.about_cta);

  const reload = useCallback(async () => {
    setLoading(true);
    const keys = ["about_hero","about_values","about_highlights","about_leadership","about_cta"];
    const { data, error } = await supabase.from("site_content").select("key, value").in("key", keys);
    if (error) { setError(error.message); setLoading(false); return; }
    const map = new Map((data ?? []).map((r) => [r.key, r.value as unknown]));
    if (map.get("about_hero")) setHero(map.get("about_hero") as AboutHero);
    if (map.get("about_values")) setValues(map.get("about_values") as AboutValue[]);
    if (map.get("about_highlights")) setHighlights(map.get("about_highlights") as AboutHighlight[]);
    if (map.get("about_leadership")) setLeadership(map.get("about_leadership") as AboutLeader[]);
    if (map.get("about_cta")) setCta(map.get("about_cta") as AboutCta);
    setLoading(false);
  }, []);
  useEffect(() => { reload(); }, [reload]);

  if (loading) return <p className="text-muted-foreground">Carregando...</p>;

  return (
    <div className="space-y-6">
      {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}

      <AboutSection title="Hero (topo da página)" onSave={() => saveContent("about_hero", hero)}>
        <TextField label="Eyebrow" value={hero.eyebrow} onChange={(v) => setHero({ ...hero, eyebrow: v })} />
        <TextField label="Título (parte comum)" value={hero.title_pre} onChange={(v) => setHero({ ...hero, title_pre: v })} />
        <TextField label="Título (parte destacada)" value={hero.title_highlight} onChange={(v) => setHero({ ...hero, title_highlight: v })} />
        <TextArea label="Parágrafo 1" value={hero.paragraph_1} onChange={(v) => setHero({ ...hero, paragraph_1: v })} />
        <TextArea label="Parágrafo 2" value={hero.paragraph_2} onChange={(v) => setHero({ ...hero, paragraph_2: v })} />
        <ImageField label="Imagem" value={hero.image_url} folder="about" onChange={(v) => setHero({ ...hero, image_url: v })} />
      </AboutSection>

      <AboutSection title="Valores (missão, visão, valores)" onSave={() => saveContent("about_values", values)}>
        <ListEditor
          items={values}
          onChange={setValues}
          empty={{ icon: "Target", title: "", desc: "" }}
          render={(v, upd) => (
            <>
              <IconField value={v.icon} onChange={(x) => upd({ ...v, icon: x })} />
              <TextField label="Título" value={v.title} onChange={(x) => upd({ ...v, title: x })} />
              <TextArea label="Descrição" value={v.desc} onChange={(x) => upd({ ...v, desc: x })} />
            </>
          )}
        />
      </AboutSection>

      <AboutSection title="Destaques numéricos" onSave={() => saveContent("about_highlights", highlights)}>
        <ListEditor
          items={highlights}
          onChange={setHighlights}
          empty={{ icon: "Award", value: "", label: "" }}
          render={(h, upd) => (
            <>
              <IconField value={h.icon} onChange={(x) => upd({ ...h, icon: x })} />
              <TextField label="Valor (ex: 25+)" value={h.value} onChange={(x) => upd({ ...h, value: x })} />
              <TextField label="Rótulo" value={h.label} onChange={(x) => upd({ ...h, label: x })} />
            </>
          )}
        />
      </AboutSection>

      <AboutSection title="Liderança" onSave={() => saveContent("about_leadership", leadership)}>
        <ListEditor
          items={leadership}
          onChange={setLeadership}
          empty={{ icon: "HardHat", name: "", role: "", desc: "", photo_url: "" }}
          render={(p, upd) => (
            <>
              <IconField value={p.icon} onChange={(x) => upd({ ...p, icon: x })} />
              <TextField label="Nome" value={p.name} onChange={(x) => upd({ ...p, name: x })} />
              <TextField label="Cargo" value={p.role} onChange={(x) => upd({ ...p, role: x })} />
              <TextArea label="Descrição" value={p.desc} onChange={(x) => upd({ ...p, desc: x })} />
              <ImageField label="Foto" value={p.photo_url} folder="leadership" onChange={(x) => upd({ ...p, photo_url: x })} />
            </>
          )}
        />
      </AboutSection>

      <AboutSection title="CTA final" onSave={() => saveContent("about_cta", cta)}>
        <TextField label="Título" value={cta.title} onChange={(v) => setCta({ ...cta, title: v })} />
        <TextArea label="Descrição" value={cta.desc} onChange={(v) => setCta({ ...cta, desc: v })} />
        <TextField label="Texto do botão" value={cta.button_label} onChange={(v) => setCta({ ...cta, button_label: v })} />
      </AboutSection>
    </div>
  );
}

function AboutSection({ title, onSave, children }: { title: string; onSave: () => Promise<void>; children: React.ReactNode }) {
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  async function handle() {
    setSaving(true); setMsg(null);
    try { await onSave(); setMsg("Salvo."); } catch (e) { setMsg(e instanceof Error ? e.message : "Falha ao salvar"); }
    setSaving(false);
  }
  return (
    <article className="card-surface p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center gap-3">
          {msg && <span className="text-xs text-muted-foreground">{msg}</span>}
          <button onClick={handle} disabled={saving} className="btn-primary"><Save className="h-4 w-4" /> {saving ? "..." : "Salvar seção"}</button>
        </div>
      </div>
      <div className="mt-4 space-y-3">{children}</div>
    </article>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-background/60 px-3 py-2 text-sm outline-none focus:border-brand-red" />
    </label>
  );
}
function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-white/10 bg-background/60 px-3 py-2 text-sm outline-none focus:border-brand-red" />
    </label>
  );
}
function IconField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">Ícone</span>
      <IconPicker value={value} onChange={onChange} />
    </label>
  );
}
function ImageField({ label, value, folder, onChange }: { label: string; value: string; folder: string; onChange: (v: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  async function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true); setMsg(null);
    try { const url = await uploadImage(file, folder); onChange(url); setMsg("Imagem enviada. Lembre de salvar a seção."); }
    catch (err) { setMsg(err instanceof Error ? err.message : "Falha no upload"); }
    finally { setUploading(false); e.target.value = ""; }
  }
  return (
    <div className="space-y-2">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="flex items-start gap-3">
        {value && <img src={value} alt="" className="h-24 w-24 rounded-lg border border-white/10 object-cover" />}
        <div className="flex-1 space-y-2">
          <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="URL da imagem" className="w-full rounded-lg border border-white/10 bg-background/60 px-3 py-2 text-xs outline-none focus:border-brand-red" />
          <label className="btn-ghost inline-flex cursor-pointer">
            <Upload className="h-4 w-4" /> {uploading ? "Enviando..." : "Enviar PNG/JPG"}
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handle} className="hidden" disabled={uploading} />
          </label>
          {msg && <p className="text-xs text-muted-foreground">{msg}</p>}
        </div>
      </div>
    </div>
  );
}

function ListEditor<T>({ items, onChange, empty, render }: { items: T[]; onChange: (v: T[]) => void; empty: T; render: (item: T, upd: (next: T) => void) => React.ReactNode }) {
  function updateAt(i: number, next: T) { const copy = items.slice(); copy[i] = next; onChange(copy); }
  function removeAt(i: number) { const copy = items.slice(); copy.splice(i, 1); onChange(copy); }
  function add() { onChange([...items, { ...empty }]); }
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={i} className="rounded-lg border border-white/10 bg-background/40 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Item #{i + 1}</span>
            <button onClick={() => removeAt(i)} className="text-xs text-red-300 hover:underline"><Trash2 className="inline h-3 w-3" /> Remover</button>
          </div>
          <div className="space-y-3">{render(it, (n) => updateAt(i, n))}</div>
        </div>
      ))}
      <button onClick={add} className="btn-ghost"><Plus className="h-4 w-4" /> Adicionar item</button>
    </div>
  );
}
