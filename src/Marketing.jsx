import { useState } from "react";

const C = "#06b6d4";

const TYPES = [
  { id: "post", label: "Post Instagram", icon: "📸" },
  { id: "reel", label: "Script Reel/TikTok", icon: "🎬" },
  { id: "story", label: "Story", icon: "⚡" },
  { id: "dm", label: "DM Influenceur", icon: "📩" },
];

const TAGS = [
  "Progression squat",
  "Améliorer son bench press",
  "Progression deadlift",
  "Nutrition pour powerlifter",
  "Présenter le générateur La Forge AI",
  "Récupération et sommeil",
  "Erreurs débutants powerlifting",
  "Motivation et mindset",
  "Les tractions en powerlifting",
  "Préparation compétition",
];

const TONS = [
  { value: "éducatif et expert", label: "Éducatif & Expert" },
  { value: "motivant et énergique", label: "Motivant & Énergique" },
  { value: "direct et sans filtre", label: "Direct & Sans filtre" },
  { value: "storytelling personnel", label: "Storytelling" },
];

const PROMPTS = {
  post: `Tu es un expert en marketing Instagram pour le powerlifting. Génère un post Instagram complet en français pour le compte @leveluppowerlifting (coaching powerlifting, athlète créateur).

Sujet : SUJET
Ton : TON

Format obligatoire :
1. Accroche forte (1-2 lignes qui donnent envie de lire)
2. Corps du post (conseil, valeur, storytelling)
3. Call to action
4. 20-25 hashtags powerlifting français et anglais
5. Description de l'image/vidéo idéale à filmer

Sois direct et authentique, comme un athlète qui parle à des athlètes.`,

  reel: `Tu es un expert en création de contenu TikTok/Reels pour le powerlifting. Génère un script complet en français pour @leveluppowerlifting.

Sujet : SUJET
Ton : TON

Format :
1. Hook (0-3 secondes) — phrase qui fait stopper le scroll
2. Script complet seconde par seconde (30-60 secondes)
3. Ce qu'on voit à l'écran
4. Musique suggérée
5. Légende + hashtags
6. Conseil de montage`,

  story: `Tu es un expert en Instagram Stories pour le powerlifting. Génère une série de 4-5 stories en français pour @leveluppowerlifting.

Sujet : SUJET
Ton : TON

Pour chaque story :
- Texte à afficher
- Visuel suggéré
- Stickers/interactions (sondage, question, lien)
La dernière story doit avoir un call to action clair.`,

  dm: `Tu es un expert en outreach Instagram pour le powerlifting. Génère un DM de prospection en français pour contacter un influenceur powerlifting.

La Forge AI = générateur de programme powerlifting par IA, 19€, PDF immédiat. Commission influenceur : 20% sur chaque vente + code promo exclusif.

Contexte : SUJET
Ton : TON

Le DM doit être :
- Court (5-6 lignes max)
- Naturel et authentique
- Mettre en avant la valeur pour eux ET leur audience
- Finir par une question ouverte`,
};

export default function Marketing() {
  const [type, setType] = useState("post");
  const [sujet, setSujet] = useState("");
  const [ton, setTon] = useState("éducatif et expert");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!sujet.trim()) { alert("Décris le sujet !"); return; }
    setLoading(true); setResult("");
    const prompt = PROMPTS[type].replace("SUJET", sujet).replace("TON", ton);
    try {
      const r = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-5-20250929",
          max_tokens: 1500,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const reader = r.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const raw = line.slice(6).trim();
            if (raw === "[DONE]") continue;
            try {
              const json = JSON.parse(raw);
              if (json.type === "content_block_delta" && json.delta && json.delta.text) {
                fullText += json.delta.text;
                setResult(fullText);
              }
            } catch(e) {}
          }
        }
      }
    } catch(e) { setResult("Erreur : " + e.message); }
    setLoading(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const chip = (active) => ({
    padding: "0.4rem 0.75rem", borderRadius: 8, cursor: "pointer",
    fontSize: "0.8rem", fontFamily: "inherit", transition: "all 0.15s",
    background: active ? C + "22" : "#0a0814",
    color: active ? C : "#4a6070",
    border: "1px solid " + (active ? C : "#1a2535"),
    fontWeight: active ? 700 : 400
  });

  const inp = {
    width: "100%", background: "#0a0814", border: "1px solid #1a2535",
    borderRadius: 8, padding: "0.65rem 0.85rem", color: "#cffafe",
    fontSize: "0.88rem", outline: "none", fontFamily: "inherit"
  };

  const lbl = {
    display: "block", fontSize: "0.65rem", letterSpacing: "0.12em",
    textTransform: "uppercase", color: "#2a4050", marginBottom: "0.5rem"
  };

  return (
    <div style={{ minHeight: "100vh", background: "#07050f", fontFamily: "'DM Sans',sans-serif", color: "#cffafe", padding: "1.5rem 1rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700&display=swap" rel="stylesheet" />
      <style>{"textarea{resize:vertical}input:focus,textarea:focus,select:focus{border-color:" + C + "!important}"}</style>

      <div style={{ width: "100%", maxWidth: 640 }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.6rem", letterSpacing: "0.3em", color: C, textTransform: "uppercase" }}>La Forge AI</div>
          <h1 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "2rem", color: "#fff", margin: 0, letterSpacing: "0.06em" }}>
            MARKETING <span style={{ color: C }}>AGENT</span>
          </h1>
          <p style={{ color: "#1a4050", fontSize: "0.78rem", marginTop: "0.2rem" }}>Générateur de contenu Instagram & TikTok</p>
        </div>

        <div style={{ background: "#080612", border: "1px solid #1a2535", borderRadius: 16, padding: "1.5rem" }}>

          {/* TYPE */}
          <div style={{ marginBottom: "1.2rem" }}>
            <label style={lbl}>Type de contenu</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              {TYPES.map(t => (
                <button key={t.id} onClick={() => setType(t.id)} style={{ ...chip(type === t.id), padding: "0.65rem", textAlign: "center" }}>
                  <div style={{ fontSize: "1.3rem", marginBottom: "3px" }}>{t.icon}</div>
                  <div style={{ fontSize: "0.78rem" }}>{t.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* SUJET */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={lbl}>Sujet / Idée</label>
            <textarea
              style={{ ...inp, minHeight: 80 }}
              placeholder="Ex: Les tractions pour progresser en deadlift..."
              value={sujet}
              onChange={e => setSujet(e.target.value)}
            />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.5rem" }}>
              {TAGS.map(tag => (
                <button key={tag} onClick={() => setSujet(tag)} style={{ ...chip(sujet === tag), fontSize: "0.72rem", padding: "0.25rem 0.6rem" }}>{tag}</button>
              ))}
            </div>
          </div>

          {/* TON */}
          <div style={{ marginBottom: "1.2rem" }}>
            <label style={lbl}>Ton</label>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {TONS.map(t => (
                <button key={t.value} onClick={() => setTon(t.value)} style={{ ...chip(ton === t.value), fontSize: "0.78rem" }}>{t.label}</button>
              ))}
            </div>
          </div>

          {/* BOUTON */}
          <button
            onClick={generate}
            disabled={loading}
            style={{
              width: "100%", padding: "0.9rem", borderRadius: 10, border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              background: loading ? "#0a1520" : "linear-gradient(135deg, " + C + ", #0891b2)",
              color: loading ? "#1a3040" : "#07050f",
              fontWeight: 700, fontSize: "1rem", fontFamily: "'Bebas Neue',cursive",
              letterSpacing: "0.12em", marginBottom: "1.2rem",
              boxShadow: loading ? "none" : "0 4px 20px " + C + "44"
            }}
          >
            {loading ? "⏳ Génération..." : "🔨 GÉNÉRER LE CONTENU"}
          </button>

          {/* RÉSULTAT */}
          {result && (
            <div style={{ background: "#050810", border: "1px solid #1a2535", borderRadius: 10, padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.7rem", color: C, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>
                  {TYPES.find(t => t.id === type)?.label}
                </span>
                <button onClick={copy} style={{ ...chip(false), fontSize: "0.75rem", padding: "0.3rem 0.8rem" }}>
                  {copied ? "✅ Copié !" : "📋 Copier"}
                </button>
              </div>
              <div style={{ color: "#a5f3fc", fontSize: "0.85rem", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                {result}
              </div>
            </div>
          )}

          {loading && !result && (
            <div style={{ textAlign: "center", padding: "1.5rem", color: "#1a4050" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔨</div>
              <div style={{ fontSize: "0.85rem" }}>Génération en cours...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
