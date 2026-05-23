import { useState } from "react";

const C = "#06b6d4";

const OBJECTIFS = [
  "Prise de masse",
  "Sèche / Perte de gras",
  "Recomposition corporelle",
  "Perte de poids",
  "Hypertrophie",
  "Bodybuilding compétition",
  "Remise en forme",
  "Powerbuilding",
  "Objectif personnalisé...",
];

const NIVEAUX = ["Débutant", "Intermédiaire", "Avancé"];
const GENRES = ["Homme", "Femme"];
const NEAT = [
  "Sédentaire (bureau)",
  "Légèrement actif",
  "Actif (travail physique)",
  "Très actif (intense)",
];
const FREQUENCES = ["3", "4", "5", "6"];
const SEMAINES = ["4", "6", "8", "10", "12", "16"];
const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const DUREES_SEANCE = ["45 min", "1h", "1h30", "2h"];
const MATERIELS = [
  "Salle complète",
  "Home gym",
  "Haltères uniquement",
  "Machines uniquement",
  "Poids du corps",
];
const FORMATS = [
  { id: "Full Body", label: "Full Body", desc: "Tout le corps / séance" },
  { id: "Upper/Lower", label: "Upper / Lower", desc: "Haut / Bas alternés" },
  { id: "Push Pull Legs", label: "Push Pull Legs", desc: "PPL classique" },
  { id: "Bro Split", label: "Bro Split", desc: "1 groupe / jour" },
  { id: "Arnold Split", label: "Arnold Split", desc: "Poitrine+Dos / Épaules+Bras / Jambes" },
  { id: "Powerbuilding", label: "Powerbuilding", desc: "Force + Volume" },
];
const RYTHMES = ["Lent et sain", "Modéré", "Rapide et agressif"];
const MUSCLES = ["Pectoraux", "Dos", "Épaules", "Bras", "Jambes", "Fessiers", "V-shape", "Abdominaux"];
const BLESSURES_OPTS = ["Épaules", "Bas du dos", "Genoux", "Hanches", "Poignets", "Cervicales", "Aucune"];
const PREFS_ALIM = ["Végétarien", "Sans lactose", "Budget serré", "Rapide à préparer"];

function buildPrompt(f) {
  const poids = parseFloat(f.weight || 75);
  const taille = parseFloat(f.height || 175);
  const age = parseFloat(f.age || 25);

  const bmr = f.gender === "Femme"
    ? 10 * poids + 6.25 * taille - 5 * age - 161
    : 10 * poids + 6.25 * taille - 5 * age + 5;

  const neatMult = {
    "Sédentaire (bureau)": 1.2,
    "Légèrement actif": 1.375,
    "Actif (travail physique)": 1.55,
    "Très actif (intense)": 1.725,
  };
  const tdee = Math.round(bmr * (neatMult[f.neat] || 1.375));

  const calTarget =
    f.objectif === "Prise de masse" || f.objectif === "Hypertrophie" || f.objectif === "Powerbuilding"
      ? tdee + (f.rythme === "Lent et sain" ? 200 : f.rythme === "Modéré" ? 350 : 500)
      : f.objectif === "Sèche / Perte de gras" || f.objectif === "Perte de poids"
      ? tdee - (f.rythme === "Lent et sain" ? 300 : f.rythme === "Modéré" ? 500 : 750)
      : f.objectif === "Recomposition corporelle"
      ? tdee
      : tdee;

  const protMin = Math.round(poids * 1.8);
  const protMax = Math.round(poids * 2.2);
  const lipMin = Math.round(poids * 0.8);
  const lipMax = Math.round(poids * 1.0);
  const glucides = Math.round((calTarget - protMin * 4 - lipMin * 9) / 4);

  const volumeParNiveau =
    f.niveau === "Débutant"
      ? "10-12 séries par muscle par semaine, RPE 7-8 (2-3 reps de réserve)"
      : f.niveau === "Intermédiaire"
      ? "12-16 séries par muscle par semaine, RPE 8-9"
      : "16-20 séries par muscle par semaine, RPE 9-10 (proche échec)";

  const objectifFinal = f.objectif === "Objectif personnalisé..." ? f.objectif_custom : f.objectif;
  const blessures = f.blessures && f.blessures.length ? f.blessures.join(", ") : "Aucune";
  const musclesPrio = f.muscles_prio && f.muscles_prio.length ? f.muscles_prio.join(", ") : "Équilibré";
  const joursChoisis = f.jours && f.jours.length ? f.jours.join(", ") : "Non spécifiés";
  const prefsAlim = f.prefs_alim && f.prefs_alim.length ? f.prefs_alim.join(", ") : "Aucune";
  const exercicesPref = f.exercices_pref ? f.exercices_pref : "Aucune préférence";

  return `Tu es un coach expert en musculation et nutrition sportive. Génère un programme COMPLET et PERSONNALISÉ sur ${f.semaines} semaines.

PROFIL :
- Nom : ${f.name || "Athlète"} | Genre : ${f.gender} | Âge : ${age} ans | Poids : ${poids} kg | Taille : ${taille} cm
- Niveau : ${f.niveau} | Objectif : ${objectifFinal}
- Fréquence : ${f.frequency}x/semaine | Format : ${f.format} | Durée par séance : ${f.duree_seance || "1h"}
- Durée programme : ${f.semaines} semaines | Jours souhaités : ${joursChoisis}
- Matériel : ${f.materiel || "Salle complète"}
- Niveau activité NEAT : ${f.neat || "Légèrement actif"}
- Rythme progression : ${f.rythme || "Modéré"}
- Muscles prioritaires : ${musclesPrio}
- Blessures/limitations : ${blessures}
- Préférences alimentaires : ${prefsAlim}

CALCULS NUTRITIONNELS (Mifflin-St Jeor) :
- BMR : ${Math.round(bmr)} kcal | TDEE : ${tdee} kcal | Cible : ${calTarget} kcal
- Protéines : ${protMin}-${protMax}g/jour (1.8-2.2g/kg)
- Lipides : ${lipMin}-${lipMax}g/jour (jamais sous 0.8g/kg)
- Glucides : ~${glucides}g/jour

RÈGLES OBLIGATOIRES :
1. VOLUME : ${volumeParNiveau}
2. MATÉRIEL : N'utilise QUE les exercices compatibles avec "${f.materiel || "Salle complète"}". Aucune exception.
3. Protéines entre 1.8g et 2.2g/kg. Lipides jamais sous 0.8g/kg.
4. Progression des charges semaine par semaine avec valeurs précises.
5. Durée séance max : ${f.duree_seance || "1h"} — adapter le nombre d'exercices en conséquence.
6. Si blessures : proposer substitutions biomécaniquement sûres (ex: si genou → remplacer squat barre par goblet squat ou presse).
7. Surcharge progressive avec valeurs précises chaque semaine.
${exercicesPref !== "Aucune préférence" ? "8. Intégrer ces exercices préférés : " + exercicesPref : ""}

STRUCTURE COMPLÈTE :

# Vue d ensemble
Durée, split ${f.format}, philosophie, objectif précis, progression attendue

## Planning hebdomadaire
| Jour | Séance | Groupes musculaires | Durée |

## Détail de chaque séance (${f.frequency} séances)
Pour chaque séance :
### Échauffement (3-4 points spécifiques)
| Exercice | Séries x Reps | Charge (kg) | RPE | Repos | Notes | Suivi |
(colonne Suivi = espace vide pour noter ses perfs)
### Récupération post-séance (3 points)

## Progression S1 à S${f.semaines}
| Semaine | Volume | Intensité | Charges clés | Focus |

## Nutrition
### Macros quotidiennes
| Macro | Quantité | Kcal | Ratio |
- TDEE : ${tdee} kcal | Cible : ${calTarget} kcal
- Jours entraînement vs repos
- Timing repas
${prefsAlim !== "Aucune" ? "- Adapter selon : " + prefsAlim : ""}
- Suppléments recommandés

## Récupération & Conseils
- Sommeil, mobilité, gestion fatigue
- Déload semaine ${f.semaines}
- 4-5 conseils spécifiques au profil et à l'objectif`;
}

export default function MuscuGenerator() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", age: "", gender: "Homme", weight: "", height: "",
    objectif: "", objectif_custom: "",
    niveau: "", neat: "", frequency: "4", semaines: "8",
    jours: [], duree_seance: "1h", materiel: "", format: "",
    rythme: "Modéré", muscles_prio: [], blessures: [],
    prefs_alim: [], exercices_pref: "",
  });
  const [program, setProgram] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleArr = (key, val) =>
    setForm(f => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val],
    }));

  const canProceed1 = form.objectif && form.niveau && form.neat;
  const canProceed2 = form.format && form.materiel;
  const canGenerate = form.weight && form.height && form.age;

  const generateProgram = async () => {
    setLoading(true); setProgram(""); setStep(4); setProgress(0);
    try {
      const r = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-5-20250929",
          max_tokens: 8000,
          messages: [{ role: "user", content: buildPrompt(form) }],
        }),
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
                setProgram(fullText);
                setProgress(Math.min(95, Math.round((fullText.length / 28000) * 100)));
              }
              if (json.type === "message_stop") setProgress(100);
            } catch (e) {}
          }
        }
      }
      if (!fullText) setProgram("Erreur de connexion. Veuillez réessayer.");
      else setProgress(100);
    } catch (e) {
      setProgram("Erreur de connexion. Veuillez réessayer.");
    }
    setLoading(false);
  };

  const exportPDF = async () => {
    setExportingPDF(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const objectifFinal = form.objectif === "Objectif personnalisé..." ? form.objectif_custom : form.objectif;

      const lines = program.split("\n");
      let bodyHtml = "";
      let inTable = false;
      let tableRows = [];

      function flushTable() {
        if (!tableRows.length) return;
        let t = '<table style="width:100%;border-collapse:collapse;margin:4px 0 8px 0;font-size:8pt;">';
        tableRows.forEach(function (row, ri) {
          const bg = ri === 0 ? "#334155" : ri % 2 === 0 ? "#f8fafc" : "#ffffff";
          const color = ri === 0 ? "#ffffff" : "#1e293b";
          const fw = ri === 0 ? "700" : "400";
          t += '<tr style="background:' + bg + ';">';
          row.forEach(function (cell) {
            const tag = ri === 0 ? "th" : "td";
            t +=
              "<" + tag + ' style="padding:4px 7px;border-bottom:1px solid #e2e8f0;color:' + color + ";font-weight:" + fw + ';font-size:7.5pt;text-align:left;">' +
              cell.trim().replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") +
              "</" + tag + ">";
          });
          t += "</tr>";
        });
        t += "</table>";
        bodyHtml += t;
        tableRows = [];
        inTable = false;
      }

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith("|")) {
          const cells = line.split("|").filter(function (_, idx, arr) { return idx > 0 && idx < arr.length - 1; });
          if (!cells.every(function (c) { return c.trim().match(/^[-:]+$/); })) { tableRows.push(cells); inTable = true; }
          continue;
        }
        if (inTable) flushTable();
        if (!line.trim()) { bodyHtml += '<div style="height:5px;"></div>'; continue; }
        if (line.startsWith("# ")) { bodyHtml += '<div style="background:#1e293b;color:#fff;padding:7px 14px;font-size:11pt;font-weight:800;text-transform:uppercase;letter-spacing:1px;margin:14px 0 5px 0;">' + line.slice(2) + "</div>"; continue; }
        if (line.startsWith("## ")) { bodyHtml += '<div style="background:#f1f5f9;border-left:3px solid #06b6d4;color:#1e293b;padding:5px 10px;font-size:10pt;font-weight:700;margin:10px 0 5px 0;">' + line.slice(3) + "</div>"; continue; }
        if (line.startsWith("### ")) { bodyHtml += '<div style="color:#1e293b;font-size:9pt;font-weight:700;margin:7px 0 3px 0;padding-bottom:3px;border-bottom:1px solid #e2e8f0;">' + line.slice(4) + "</div>"; continue; }
        if (line.startsWith("- ") || line.startsWith("* ")) { bodyHtml += '<div style="display:flex;gap:7px;margin-bottom:2px;"><span style="color:#06b6d4;font-weight:700;flex-shrink:0;">&#8226;</span><span style="font-size:8.5pt;color:#334155;line-height:1.6;">' + line.slice(2).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") + "</span></div>"; continue; }
        bodyHtml += '<p style="font-size:8.5pt;color:#334155;line-height:1.6;margin:2px 0;">' + line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") + "</p>";
      }
      if (inTable) flushTable();

      const container = document.createElement("div");
      container.style.cssText = "font-family:Arial,Helvetica,sans-serif;font-size:9.5pt;color:#1a1a1a;background:#fff;width:190mm;padding:0;margin:0;";

      const headerHtml = '<div style="background:#07050f;padding:14px 20px;display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid #06b6d4;"><div><div style="font-size:20pt;font-weight:900;color:#06b6d4;letter-spacing:2px;">LA FORGE AI</div><div style="font-size:8pt;color:#7dd3e0;margin-top:2px;">G&eacute;n&eacute;rateur Musculation &mdash; Programme personnalis&eacute; par IA</div></div><div style="color:#7dd3e0;font-size:8pt;">' + new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) + "</div></div>";

      const profilHtml =
        '<div style="padding:14px 20px;background:#f8fafc;border-bottom:1px solid #e2e8f0;"><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px 14px;margin-bottom:10px;">' +
        '<div><div style="font-size:7pt;color:#64748b;text-transform:uppercase;margin-bottom:2px;">Athl&egrave;te</div><div style="font-size:11pt;font-weight:700;">' + (form.name || "&mdash;") + "</div></div>" +
        '<div><div style="font-size:7pt;color:#64748b;text-transform:uppercase;margin-bottom:2px;">&Acirc;ge</div><div style="font-size:11pt;font-weight:700;">' + (form.age ? form.age + " ans" : "&mdash;") + "</div></div>" +
        '<div><div style="font-size:7pt;color:#64748b;text-transform:uppercase;margin-bottom:2px;">Poids</div><div style="font-size:11pt;font-weight:700;">' + (form.weight ? form.weight + " kg" : "&mdash;") + "</div></div>" +
        '<div><div style="font-size:7pt;color:#64748b;text-transform:uppercase;margin-bottom:2px;">Niveau</div><div style="font-size:11pt;font-weight:700;">' + (form.niveau || "&mdash;") + "</div></div>" +
        '<div><div style="font-size:7pt;color:#64748b;text-transform:uppercase;margin-bottom:2px;">Objectif</div><div style="font-size:11pt;font-weight:700;">' + (objectifFinal || "&mdash;") + "</div></div>" +
        '<div><div style="font-size:7pt;color:#64748b;text-transform:uppercase;margin-bottom:2px;">Format</div><div style="font-size:11pt;font-weight:700;">' + (form.format || "&mdash;") + "</div></div>" +
        '<div><div style="font-size:7pt;color:#64748b;text-transform:uppercase;margin-bottom:2px;">Mat&eacute;riel</div><div style="font-size:11pt;font-weight:700;">' + (form.materiel || "&mdash;") + "</div></div>" +
        '<div><div style="font-size:7pt;color:#64748b;text-transform:uppercase;margin-bottom:2px;">Dur&eacute;e</div><div style="font-size:11pt;font-weight:700;">' + form.semaines + " semaines</div></div>" +
        '</div><div style="background:#06b6d4;color:#fff;text-align:center;padding:6px;border-radius:4px;font-weight:700;font-size:10pt;letter-spacing:1px;">' + (objectifFinal || "").toUpperCase() + " &mdash; " + form.frequency + "x/SEMAINE &mdash; " + (form.duree_seance || "1h") + "/S&Eacute;ANCE</div></div>";

      const footerHtml = '<div style="border-top:2px solid #06b6d4;padding:8px 20px;display:flex;justify-content:space-between;background:#f8fafc;"><span style="font-size:7.5pt;color:#64748b;">La Forge AI &mdash; Programme Musculation g&eacute;n&eacute;r&eacute; par IA</span><span style="font-size:7.5pt;color:#64748b;">' + (form.name || "Athl&egrave;te") + " | " + new Date().toLocaleDateString("fr-FR") + "</span></div>";

      container.innerHTML = headerHtml + profilHtml + '<div style="padding:0 20px 14px 20px;">' + bodyHtml + "</div>" + footerHtml;
      document.body.appendChild(container);

      await html2pdf().set({
        margin: [8, 8, 8, 8],
        filename: "programme_musculation_" + (form.name || "athlete").toLowerCase().replace(/\s+/g, "_") + ".pdf",
        image: { type: "jpeg", quality: 0.97 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true, windowWidth: 794 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"] },
      }).from(container).save();

      document.body.removeChild(container);
    } catch (e) {
      alert("Erreur PDF : " + e.message);
    }
    setExportingPDF(false);
  };

  const reset = () => { setStep(1); setProgram(""); setProgress(0); };

  const chip = (active) => ({ padding: "0.45rem 0.75rem", borderRadius: 8, cursor: "pointer", fontSize: "0.82rem", fontFamily: "inherit", transition: "all 0.15s", background: active ? C + "22" : "#0a0814", color: active ? C : "#4a6070", border: "1px solid " + (active ? C : "#1a2535"), fontWeight: active ? 700 : 400 });
  const lbl = { display: "block", fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#2a4050", marginBottom: "0.4rem" };
  const inp = { width: "100%", background: "#0a0814", border: "1px solid #1a2535", borderRadius: 8, padding: "0.6rem 0.8rem", color: "#cffafe", fontSize: "0.88rem", outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
  const pBtn = (disabled) => ({ width: "100%", padding: "0.85rem", borderRadius: 10, fontFamily: "'Bebas Neue',cursive", letterSpacing: "0.12em", fontSize: "1.05rem", border: "none", cursor: disabled ? "not-allowed" : "pointer", background: disabled ? "#0a1520" : "linear-gradient(135deg," + C + ",#0891b2)", color: disabled ? "#1a3040" : "#07050f", fontWeight: 700, boxShadow: disabled ? "none" : "0 4px 20px " + C + "44" });
  const card = { padding: "1rem", background: "#080612", borderRadius: 10, border: "1px solid #1a2535", marginBottom: "1rem" };

  const renderMD = (text) => text.split("\n").map((line, i) => {
    if (line.startsWith("# ")) return <h1 key={i} style={{ color: C, fontSize: "1.3rem", fontFamily: "'Bebas Neue',cursive", marginTop: "1.5rem", borderBottom: "2px solid " + C, paddingBottom: "0.3rem" }}>{line.slice(2)}</h1>;
    if (line.startsWith("## ")) return <h2 key={i} style={{ color: C, fontSize: "1.05rem", marginTop: "1.2rem", fontWeight: 700 }}>{line.slice(3)}</h2>;
    if (line.startsWith("### ")) return <h3 key={i} style={{ color: "#67e8f9", fontSize: "0.95rem", marginTop: "0.8rem", fontWeight: 600 }}>{line.slice(4)}</h3>;
    if (line.startsWith("- ") || line.startsWith("* ")) return <div key={i} style={{ display: "flex", gap: "0.5rem", margin: "0.2rem 0" }}><span style={{ color: C, fontSize: "0.5rem", marginTop: "0.4rem" }}>◆</span><span style={{ color: "#cffafe", fontSize: "0.88rem", lineHeight: 1.7 }}>{line.slice(2)}</span></div>;
    if (line.startsWith("|")) {
      const cells = line.split("|").filter((_, i, a) => i > 0 && i < a.length - 1);
      if (cells.every(c => c.trim().match(/^[-:]+$/))) return null;
      return <div key={i} style={{ display: "grid", gridTemplateColumns: "repeat(" + cells.length + ",1fr)", gap: "1px", marginBottom: "1px" }}>{cells.map((cell, ci) => <div key={ci} style={{ background: "#0c1a20", padding: "0.3rem 0.5rem", fontSize: "0.75rem", color: "#a5f3fc", borderLeft: ci === 0 ? "2px solid " + C : "none" }}>{cell.trim()}</div>)}</div>;
    }
    if (!line.trim()) return <br key={i} />;
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return <p key={i} style={{ color: "#a5f3fc80", fontSize: "0.88rem", lineHeight: 1.8, margin: "0.15rem 0" }}>{parts.map((p, j) => j % 2 === 1 ? <strong key={j} style={{ color: "#e0f7fa" }}>{p}</strong> : p)}</p>;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#07050f", fontFamily: "'DM Sans',sans-serif", color: "#cffafe", display: "flex", flexDirection: "column", alignItems: "center", padding: "1.5rem 1rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700&display=swap" rel="stylesheet" />
      <style>{"input::placeholder{color:#1a3040}input:focus,textarea:focus{border-color:" + C + "!important}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#0e4a5a;border-radius:2px}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}"}</style>

      <div style={{ width: "100%", maxWidth: 680, marginBottom: "1.5rem" }}>
        <div style={{ fontSize: "0.6rem", letterSpacing: "0.3em", color: C, textTransform: "uppercase" }}>La Forge AI</div>
        <h1 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "2.4rem", letterSpacing: "0.06em", margin: 0, color: "#fff", lineHeight: 1 }}>
          MUSCULATION<span style={{ color: C }}> GENERATOR</span>
        </h1>
        <p style={{ color: "#1a4050", fontSize: "0.82rem", marginTop: "0.3rem" }}>Programme personnalisé par IA • Masse • Sèche • Recomposition</p>
      </div>

      <div style={{ width: "100%", maxWidth: 680 }}>
        {step < 4 && (
          <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.5rem", alignItems: "center" }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: step >= s ? C : "#0a0814", color: step >= s ? "#07050f" : "#1a3040", fontWeight: 700, fontSize: "0.8rem", border: "1px solid " + (step >= s ? C : "#1a2535") }}>{s}</div>
                {s < 3 && <div style={{ width: 40, height: 2, background: step > s ? C : "#1a2535" }} />}
              </div>
            ))}
            <span style={{ marginLeft: "0.5rem", fontSize: "0.78rem", color: "#1a4050" }}>{step === 1 ? "Objectifs & Niveau" : step === 2 ? "Programme" : "Profil & Détails"}</span>
          </div>
        )}

        <div style={{ background: "#080612", border: "1px solid #1a2535", borderRadius: 16, padding: "1.75rem", boxShadow: "0 20px 60px rgba(6,182,212,0.08)", animation: "fadeIn 0.3s ease" }}>

          {/* STEP 1 */}
          {step === 1 && (<>
            <h2 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "1.4rem", color: C, marginTop: 0 }}>Objectifs & Niveau</h2>

            <label style={lbl}>Objectif principal</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "1.2rem" }}>
              {OBJECTIFS.map(o => <button key={o} onClick={() => update("objectif", o)} style={{ ...chip(form.objectif === o), textAlign: "left", fontSize: "0.82rem" }}>{form.objectif === o ? "▶ " : "○ "}{o}</button>)}
            </div>
            {form.objectif === "Objectif personnalisé..." && (
              <input style={{ ...inp, marginBottom: "1.2rem" }} placeholder="Décris ton objectif personnalisé..." value={form.objectif_custom} onChange={e => update("objectif_custom", e.target.value)} />
            )}

            <label style={lbl}>Niveau</label>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.2rem" }}>
              {NIVEAUX.map(n => <button key={n} onClick={() => update("niveau", n)} style={{ ...chip(form.niveau === n), flex: 1 }}>{n}</button>)}
            </div>

            <label style={lbl}>Niveau d&apos;activité quotidienne (hors sport)</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "1.2rem" }}>
              {NEAT.map(n => <button key={n} onClick={() => update("neat", n)} style={{ ...chip(form.neat === n), textAlign: "left", fontSize: "0.8rem" }}>{form.neat === n ? "▶ " : "○ "}{n}</button>)}
            </div>

            <button onClick={() => setStep(2)} disabled={!canProceed1} style={pBtn(!canProceed1)}>Continuer →</button>
          </>)}

          {/* STEP 2 */}
          {step === 2 && (<>
            <h2 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "1.4rem", color: C, marginTop: 0 }}>Structure du programme</h2>

            <label style={lbl}>Format d&apos;entraînement</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "1.2rem" }}>
              {FORMATS.map(f => (
                <button key={f.id} onClick={() => update("format", f.id)} style={{ ...chip(form.format === f.id), textAlign: "center", padding: "0.65rem" }}>
                  <div style={{ fontWeight: 700, marginBottom: "2px" }}>{f.label}</div>
                  <div style={{ fontSize: "0.7rem", opacity: 0.7 }}>{f.desc}</div>
                </button>
              ))}
            </div>

            <label style={lbl}>Matériel disponible</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "1.2rem" }}>
              {MATERIELS.map(m => <button key={m} onClick={() => update("materiel", m)} style={{ ...chip(form.materiel === m), textAlign: "left" }}>{form.materiel === m ? "▶ " : "○ "}{m}</button>)}
            </div>

            <label style={lbl}>Séances / semaine</label>
            <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.2rem" }}>
              {FREQUENCES.map(f => <button key={f} onClick={() => update("frequency", f)} style={{ ...chip(form.frequency === f), flex: 1 }}>{f}x</button>)}
            </div>

            <label style={lbl}>Durée par séance</label>
            <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.2rem" }}>
              {DUREES_SEANCE.map(d => <button key={d} onClick={() => update("duree_seance", d)} style={{ ...chip(form.duree_seance === d), flex: 1 }}>{d}</button>)}
            </div>

            <label style={lbl}>Durée du programme</label>
            <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.2rem" }}>
              {SEMAINES.map(s => <button key={s} onClick={() => update("semaines", s)} style={{ ...chip(form.semaines === s), flex: 1 }}>{s}sem</button>)}
            </div>

            <div style={card}>
              <label style={{ ...lbl, color: C, marginBottom: "0.8rem" }}>📅 Jours souhaités (optionnel)</label>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {JOURS.map(j => <button key={j} onClick={() => toggleArr("jours", j)} style={{ ...chip(form.jours.includes(j)), flex: 1, minWidth: "2.5rem" }}>{j}</button>)}
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.6rem" }}>
              <button onClick={() => setStep(1)} style={{ ...pBtn(false), background: "#0a0814", boxShadow: "none", border: "1px solid #1a2535", color: "#2a4050", flex: "0 0 auto", width: "auto", padding: "0.85rem 1.4rem" }}>←</button>
              <button onClick={() => setStep(3)} disabled={!canProceed2} style={{ ...pBtn(!canProceed2), flex: 1, width: "auto" }}>Continuer →</button>
            </div>
          </>)}

          {/* STEP 3 */}
          {step === 3 && (<>
            <h2 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "1.4rem", color: C, marginTop: 0 }}>Profil & Détails</h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", marginBottom: "1rem" }}>
              {[["Prénom", "name", "text", "Alex"], ["Âge", "age", "number", "25"], ["Taille cm", "height", "number", "175"], ["Poids kg", "weight", "number", "75"]].map(([l, key, type, ph]) => (
                <div key={key}><label style={lbl}>{l}</label><input style={inp} type={type} placeholder={ph} value={form[key]} onChange={e => update(key, e.target.value)} /></div>
              ))}
              <div style={{ gridColumn: "span 2" }}>
                <label style={lbl}>Genre</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {GENRES.map(g => <button key={g} onClick={() => update("gender", g)} style={{ ...chip(form.gender === g), flex: 1 }}>{g}</button>)}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={lbl}>Rythme de progression</label>
              <div style={{ display: "flex", gap: "0.4rem" }}>
                {RYTHMES.map(r => <button key={r} onClick={() => update("rythme", r)} style={{ ...chip(form.rythme === r), flex: 1, fontSize: "0.75rem" }}>{r}</button>)}
              </div>
            </div>

            <div style={card}>
              <label style={{ ...lbl, color: C, marginBottom: "0.8rem" }}>💪 Muscles prioritaires (optionnel)</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {MUSCLES.map(m => <button key={m} onClick={() => toggleArr("muscles_prio", m)} style={{ ...chip(form.muscles_prio.includes(m)), fontSize: "0.78rem" }}>{m}</button>)}
              </div>
            </div>

            <div style={card}>
              <label style={{ ...lbl, color: C, marginBottom: "0.8rem" }}>🩺 Blessures / limitations (optionnel)</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {BLESSURES_OPTS.map(b => <button key={b} onClick={() => toggleArr("blessures", b)} style={{ ...chip(form.blessures.includes(b)), fontSize: "0.78rem" }}>{b}</button>)}
              </div>
            </div>

            <div style={card}>
              <label style={{ ...lbl, color: C, marginBottom: "0.8rem" }}>🥗 Préférences alimentaires (optionnel)</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {PREFS_ALIM.map(p => <button key={p} onClick={() => toggleArr("prefs_alim", p)} style={{ ...chip(form.prefs_alim.includes(p)), fontSize: "0.78rem" }}>{p}</button>)}
              </div>
            </div>

            <div style={card}>
              <button onClick={() => setShowAdvanced(!showAdvanced)} style={{ background: "none", border: "none", cursor: "pointer", color: C, fontFamily: "inherit", fontSize: "0.88rem", fontWeight: 700, padding: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {showAdvanced ? "▼" : "▶"} Exercices préférés (optionnel)
              </button>
              {showAdvanced && (
                <div style={{ marginTop: "0.8rem" }}>
                  <input style={inp} placeholder="Développé couché, squat, tractions, curl..." value={form.exercices_pref} onChange={e => update("exercices_pref", e.target.value)} />
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "0.6rem" }}>
              <button onClick={() => setStep(2)} style={{ ...pBtn(false), background: "#0a0814", boxShadow: "none", border: "1px solid #1a2535", color: "#2a4050", flex: "0 0 auto", width: "auto", padding: "0.85rem 1.4rem" }}>←</button>
              <button onClick={generateProgram} disabled={!canGenerate} style={{ ...pBtn(!canGenerate), flex: 1, width: "auto" }}>💪 Générer le programme</button>
            </div>
          </>)}

          {/* STEP 4 */}
          {step === 4 && (<>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
              <h2 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "1.4rem", color: C, margin: 0 }}>Programme Musculation</h2>
              {!loading && program && (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={exportPDF} disabled={exportingPDF} style={{ ...chip(true), fontSize: "0.82rem" }}>{exportingPDF ? "..." : "📄 PDF"}</button>
                  <button onClick={reset} style={{ ...chip(false), fontSize: "0.82rem" }}>Nouveau</button>
                </div>
              )}
            </div>
            {loading && (
              <div style={{ marginBottom: "1.2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                  <span style={{ fontSize: "0.78rem", color: "#1a6070" }}>💪 Génération en cours...</span>
                  <span style={{ fontSize: "0.78rem", color: C, fontWeight: 700 }}>{progress}%</span>
                </div>
                <div style={{ height: 6, background: "#0a0814", borderRadius: 4, overflow: "hidden", border: "1px solid #1a2535" }}>
                  <div style={{ height: "100%", width: progress + "%", background: "linear-gradient(90deg," + C + ",#0891b2)", borderRadius: 4, transition: "width 0.4s ease" }} />
                </div>
              </div>
            )}
            {loading && !program && (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <div style={{ fontSize: "2.5rem", animation: "pulse 1.2s infinite" }}>💪</div>
                <p style={{ color: "#1a4050", marginTop: "1rem", fontSize: "0.88rem" }}>Génération en cours...</p>
              </div>
            )}
            {program && (<>
              {!loading && (
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                  {[form.niveau, form.objectif !== "Objectif personnalisé..." ? form.objectif : form.objectif_custom, form.frequency + "x/sem", form.semaines + " sem", form.format, form.duree_seance].filter(Boolean).map((tag, i) => (
                    <span key={i} style={{ padding: "0.2rem 0.7rem", background: C + "15", border: "1px solid " + C + "40", borderRadius: 20, fontSize: "0.75rem", color: C }}>{tag}</span>
                  ))}
                </div>
              )}
              <div style={{ background: "#050810", border: "1px solid #1a2535", borderRadius: 10, padding: "1.25rem", maxHeight: "55vh", overflowY: "auto" }}>
                {renderMD(program)}
              </div>
              {!loading && <div style={{ marginTop: "0.75rem", padding: "0.5rem 1rem", background: "#050e12", borderRadius: 8, border: "1px solid #0e3040", fontSize: "0.75rem", color: "#1a6070" }}>Programme généré par IA — à affiner selon les retours</div>}
            </>)}
          </>)}

        </div>
      </div>
      <p style={{ color: "#050810", fontSize: "0.7rem", marginTop: "1.5rem" }}>La Forge AI · Propulsé par Claude · Anthropic</p>
    </div>
  );
}
