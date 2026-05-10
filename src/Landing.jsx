import { useState } from "react";

const C = "#06b6d4";
const STRIPE_LINK = "https://buy.stripe.com/test_cNieVc7az7Pd8VB2Ls3Ru00";

export default function Landing() {
  const [hovering, setHovering] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "#07050f", fontFamily: "'DM Sans',sans-serif", color: "#cffafe", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .fade-up { animation: fadeUp 0.7s ease forwards; }
        .fade-up-2 { animation: fadeUp 0.7s ease 0.15s forwards; opacity: 0; }
        .fade-up-3 { animation: fadeUp 0.7s ease 0.3s forwards; opacity: 0; }
        .fade-up-4 { animation: fadeUp 0.7s ease 0.45s forwards; opacity: 0; }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 40px rgba(6,182,212,0.6) !important; }
        .cta-btn { transition: all 0.2s ease; }
        .feature-card:hover { border-color: ${C} !important; transform: translateY(-3px); }
        .feature-card { transition: all 0.2s ease; }
        .step-num { background: linear-gradient(135deg, ${C}, #0891b2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      `}</style>

      {/* NAV */}
      <nav style={{ padding: "1.2rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #0e1f2a", background: "#07050fcc", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 100 }}>
        <div>
          <div style={{ fontSize: "0.55rem", letterSpacing: "0.3em", color: C, textTransform: "uppercase" }}>Programme IA</div>
          <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "1.5rem", color: "#fff", letterSpacing: "0.06em", lineHeight: 1 }}>LA FORGE <span style={{ color: C }}>AI</span></div>
        </div>
        <a href="/generator" style={{ background: `linear-gradient(135deg, ${C}, #0891b2)`, color: "#07050f", padding: "0.6rem 1.4rem", borderRadius: 8, fontWeight: 700, fontSize: "0.88rem", textDecoration: "none", fontFamily: "'Bebas Neue',cursive", letterSpacing: "0.1em" }}>
          GÉNÉRER MON PROGRAMME
        </a>
      </nav>

      {/* HERO */}
      <section style={{ padding: "5rem 1.5rem 4rem", textAlign: "center", maxWidth: 800, margin: "0 auto" }}>
        <div className="fade-up" style={{ display: "inline-block", background: `${C}18`, border: `1px solid ${C}44`, borderRadius: 20, padding: "0.35rem 1rem", fontSize: "0.75rem", color: C, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
          🔨 Powerlifting — Squat / Bench / Deadlift
        </div>
        <h1 className="fade-up-2" style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "clamp(2.8rem, 8vw, 5rem)", lineHeight: 1.05, margin: "0 0 1.5rem 0", color: "#fff", letterSpacing: "0.03em" }}>
          L'IA CRÉÉE PAR UN ATHLÈTE<br />
          <span style={{ color: C }}>DE POWERLIFTING</span><br />
          POUR DES ATHLÈTES
        </h1>
        <p className="fade-up-3" style={{ fontSize: "1.1rem", color: "#7dd3e0", lineHeight: 1.8, marginBottom: "2.5rem", maxWidth: 580, margin: "0 auto 2.5rem" }}>
          Programme 100% personnalisé basé sur tes 1RM, ta fréquence et tes objectifs. Charges calculées en kg, progression semaine par semaine, nutrition incluse.
        </p>
        <div className="fade-up-4" style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/generator" className="cta-btn" style={{ background: `linear-gradient(135deg, ${C}, #0891b2)`, color: "#07050f", padding: "1rem 2.5rem", borderRadius: 10, fontWeight: 700, fontSize: "1.1rem", textDecoration: "none", fontFamily: "'Bebas Neue',cursive", letterSpacing: "0.12em", boxShadow: `0 4px 24px ${C}44`, display: "inline-block" }}>
            🔨 GÉNÉRER MON PROGRAMME — 29€
          </a>
        </div>
        <p style={{ marginTop: "1rem", color: "#1a4050", fontSize: "0.8rem" }}>Téléchargement PDF immédiat • Paiement sécurisé</p>
      </section>

      {/* DIVIDER */}
      <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C}44, transparent)`, margin: "0 2rem" }} />

      {/* WHAT YOU GET */}
      <section style={{ padding: "4rem 1.5rem", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "2.2rem", color: "#fff", textAlign: "center", marginBottom: "0.5rem" }}>
          CE QUE TU <span style={{ color: C }}>REÇOIS</span>
        </h2>
        <p style={{ textAlign: "center", color: "#1a4050", marginBottom: "3rem", fontSize: "0.9rem" }}>Un programme clé en main, prêt à suivre dès demain</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
          {[
            { icon: "🏋️", title: "Charges en kg calculées", desc: "Top Set et Back-off calculés depuis tes 1RM réels. Pas d'approximations." },
            { icon: "📅", title: "Progression S1 à S16", desc: "Chaque semaine planifiée avec intensité et volume progressifs." },
            { icon: "🔥", title: "Échauffement spécifique", desc: "Protocole d'activation détaillé avant chaque séance SBD." },
            { icon: "🥩", title: "Nutrition adaptée", desc: "Macros calculées selon ton poids et objectif. Timing repas inclus." },
            { icon: "💤", title: "Récupération & déload", desc: "Protocole déload, gestion fatigue, conseils sommeil et mobilité." },
            { icon: "📄", title: "PDF téléchargeable", desc: "Export immédiat en PDF professionnel. Imprime ou utilise sur ton téléphone." },
          ].map((f, i) => (
            <div key={i} className="feature-card" style={{ background: "#080612", border: "1px solid #1a2535", borderRadius: 12, padding: "1.5rem" }}>
              <div style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>{f.icon}</div>
              <div style={{ fontWeight: 700, color: "#e0f7fa", marginBottom: "0.4rem", fontSize: "0.95rem" }}>{f.title}</div>
              <div style={{ color: "#1a6070", fontSize: "0.85rem", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "4rem 1.5rem", background: "#080612", borderTop: "1px solid #0e1f2a", borderBottom: "1px solid #0e1f2a" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "2.2rem", color: "#fff", marginBottom: "0.5rem" }}>
            COMMENT <span style={{ color: C }}>ÇA MARCHE</span>
          </h2>
          <p style={{ color: "#1a4050", marginBottom: "3rem", fontSize: "0.9rem" }}>3 étapes, moins de 3 minutes</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "2rem" }}>
            {[
              { num: "01", title: "Remplis ton profil", desc: "Tes 1RM, ta fréquence, tes objectifs, tes jours d'entraînement." },
              { num: "02", title: "L'IA génère", desc: "Programme complet créé en moins de 60 secondes, personnalisé pour toi." },
              { num: "03", title: "Télécharge ton PDF", desc: "Programme prêt à suivre, téléchargeable immédiatement en PDF." },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div className="step-num" style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "3.5rem", lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontWeight: 700, color: "#e0f7fa", margin: "0.5rem 0 0.4rem", fontSize: "0.95rem" }}>{s.title}</div>
                <div style={{ color: "#1a6070", fontSize: "0.85rem", lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CREDIBILITY */}
      <section style={{ padding: "4rem 1.5rem", maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <div style={{ background: "#080612", border: `1px solid ${C}44`, borderRadius: 16, padding: "2.5rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔨</div>
          <blockquote style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "1.6rem", color: "#fff", lineHeight: 1.3, marginBottom: "1.2rem", letterSpacing: "0.02em" }}>
            "La Forge AI a été développée par un athlète de powerlifting qui connaît les exigences du sport — pas par des développeurs qui n'ont jamais touché une barre."
          </blockquote>
          <div style={{ color: C, fontWeight: 700, fontSize: "0.88rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Athlète Powerlifting • Créateur de La Forge AI
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: "4rem 1.5rem", background: "#080612", borderTop: "1px solid #0e1f2a" }}>
        <div style={{ maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "2.2rem", color: "#fff", marginBottom: "0.5rem" }}>
            TARIF <span style={{ color: C }}>SIMPLE</span>
          </h2>
          <p style={{ color: "#1a4050", marginBottom: "2.5rem", fontSize: "0.9rem" }}>Un programme, un prix</p>
          <div style={{ background: "#07050f", border: `2px solid ${C}`, borderRadius: 16, padding: "2.5rem", marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "0.8rem", color: C, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Programme Powerlifting</div>
            <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "4rem", color: "#fff", lineHeight: 1 }}>29€</div>
            <div style={{ color: "#1a4050", fontSize: "0.8rem", marginBottom: "2rem" }}>par programme généré</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem", marginBottom: "2rem", textAlign: "left" }}>
              {["Programme complet personnalisé", "Charges en kg calculées", "Progression S1 à S16", "Nutrition & récupération", "Export PDF immédiat"].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <span style={{ color: C, fontSize: "1rem" }}>✓</span>
                  <span style={{ color: "#7dd3e0", fontSize: "0.88rem" }}>{item}</span>
                </div>
              ))}
            </div>
            <a href="/generator" className="cta-btn" style={{ display: "block", background: `linear-gradient(135deg, ${C}, #0891b2)`, color: "#07050f", padding: "1rem", borderRadius: 10, fontWeight: 700, fontSize: "1.1rem", textDecoration: "none", fontFamily: "'Bebas Neue',cursive", letterSpacing: "0.12em", boxShadow: `0 4px 24px ${C}44` }}>
              🔨 GÉNÉRER MON PROGRAMME
            </a>
          </div>
          <p style={{ color: "#0e2535", fontSize: "0.78rem" }}>Paiement sécurisé • Téléchargement immédiat</p>
        </div>
      </section>

      {/* COMING SOON */}
      <section style={{ padding: "3rem 1.5rem", maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <div style={{ color: "#1a4050", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem" }}>Bientôt disponible</div>
        <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center", flexWrap: "wrap" }}>
          {["💪 Musculation / Masse", "🔥 Sèche", "🔗 Street Lifting", "⚡ Cross Training"].map((s, i) => (
            <div key={i} style={{ background: "#080612", border: "1px solid #1a2535", borderRadius: 20, padding: "0.4rem 1rem", fontSize: "0.82rem", color: "#1a4050" }}>{s}</div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid #0e1f2a", padding: "2rem 1.5rem", textAlign: "center" }}>
        <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "1.2rem", color: C, marginBottom: "0.5rem" }}>LA FORGE AI</div>
        <p style={{ color: "#0e2535", fontSize: "0.78rem" }}>© 2026 La Forge AI • Créé par un athlète de powerlifting</p>
      </footer>
    </div>
  );
}
