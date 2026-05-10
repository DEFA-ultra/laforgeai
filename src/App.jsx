import { useState } from "react";

const C = "#06b6d4";

const NIVEAUX = ["Débutant", "Intermédiaire", "Avancé", "Élite"];
const FREQUENCES = ["2", "3", "4", "5", "6"];
const SEMAINES = ["4", "6", "8", "10", "12", "16"];
const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const SQUAT_VARIANTS = ["Back Squat Low Bar", "Back Squat High Bar", "Front Squat", "SSB Squat", "Pause Squat", "Box Squat", "Déficit Squat"];
const BENCH_VARIANTS = ["Bench Press large", "Close Grip Bench", "Pause Bench", "Spoto Press", "Floor Press", "Incline Bench"];
const DEADLIFT_VARIANTS = ["Conventional Deadlift", "Sumo Deadlift", "Romanian Deadlift", "Déficit Deadlift", "Rack Pull", "Pause Deadlift"];
const ACC_UPPER = ["Overhead Press", "Row Barre", "Pendlay Row", "Face Pull", "Curl Biceps", "Extension Triceps", "Dips lestés", "Shrug"];
const ACC_LOWER = ["Bulgarian Split Squat", "Leg Press", "Leg Extension", "Leg Curl", "Hip Thrust", "Good Morning", "Nordic Curl", "GHR"];
const OBJECTIFS_PRECIS = [
  "Compétition dans X semaines",
  "Passer mon total de X à Y kg",
  "Améliorer mon Squat",
  "Améliorer mon Bench Press",
  "Améliorer mon Deadlift",
  "Première compétition",
  "Reprise après blessure",
  "Objectif personnalisé...",
];

function buildPrompt(form) {
  const poids = parseFloat(form.weight || 80);
  const semaines = form.semaines || "8";
  const joursChoisis = form.jours?.length ? `Jours souhaités : ${form.jours.join(", ")}` : "";
  const forceFreq = `\nFRÉQUENCE PAR MOUVEMENT :\n- Squat : ${form.squat_freq || "2"}x/semaine\n- Bench Press : ${form.bench_freq || "3"}x/semaine\n- Deadlift : ${form.deadlift_freq || "1"}x/semaine`;
  const prefs = [];
  if (form.squat_variants?.length) prefs.push(`Squat préféré : ${form.squat_variants.join(", ")}`);
  if (form.bench_variants?.length) prefs.push(`Bench préféré : ${form.bench_variants.join(", ")}`);
  if (form.deadlift_variants?.length) prefs.push(`Deadlift préféré : ${form.deadlift_variants.join(", ")}`);
  if (form.upper_acc?.length) prefs.push(`Accessoires haut : ${form.upper_acc.join(", ")}`);
  if (form.lower_acc?.length) prefs.push(`Accessoires bas : ${form.lower_acc.join(", ")}`);
  const exoPrefs = prefs.length ? `\nEXERCICES PRÉFÉRÉS :\n${prefs.join("\n")}` : "";

  return `Tu es un coach expert en Powerlifting. Génère un programme COMPLET, DÉTAILLÉ sur ${semaines} semaines.

PROFIL :
- Nom : ${form.name || "Athlète"} | Âge : ${form.age || "—"} ans | Poids : ${poids} kg | Genre : ${form.gender || "Homme"}
- Niveau : ${form.niveau} | ${form.frequency}x/semaine
- 1RM : Squat ${form.squat || "—"} kg | Bench ${form.bench || "—"} kg | Deadlift ${form.deadlift || "—"} kg | Total : ${(parseInt(form.squat)||0)+(parseInt(form.bench)||0)+(parseInt(form.deadlift)||0)} kg
- Blessures : ${form.injuries || "Aucune"}
- OBJECTIF PRÉCIS : ${form.objectif_precis || "Progression générale"}
${joursChoisis}
${forceFreq}
${exoPrefs}

RÈGLES OBLIGATOIRES :
1. TOP SET (75-95% 1RM, RPE 8-9) + BACK-OFF (-10%, RPE 6-8) sur chaque mouvement principal
2. Charges en kg précises calculées depuis les 1RM
3. RPE et temps de repos indiqués pour chaque exercice
4. Progression semaine par semaine avec charges exactes

STRUCTURE COMPLÈTE :

# Vue d'ensemble
Durée, philosophie, objectif visé, progression attendue

## Planning hebdomadaire
| Jour | Séance | Focus | Durée |

## Détail de CHAQUE séance (${form.frequency} séances)
Pour chaque séance :
### Échauffement spécifique (détaillé)
| Exercice | Séries x Reps | Charge (kg) | % 1RM | RPE | Repos | Notes |
### Récupération post-séance

## Progression S1 à S${semaines}
| Semaine | Squat Top Set | Bench Top Set | Deadlift Top Set | Volume total | Notes |

## Nutrition
Calories, protéines, glucides, lipides, timing repas, suppléments

IMPORTANT : Sois concis sur les échauffements (3-4 lignes max), regroupe les accessoires en un seul tableau par séance. Garde suffisamment de place pour la nutrition et la récupération.

## Progression S1 à S${semaines}
| Semaine | Squat Top Set | Bench Top Set | Deadlift Top Set | Intensité | Focus |

## Nutrition
### Macros quotidiennes
| Macro | Quantité | Kcal |
- TDEE estimé et calories cibles
- Timing repas (avant/après entraînement)
- Suppléments recommandés (créatine, whey, etc.)

## Récupération & Conseils
### Sommeil
- Recommandations spécifiques powerlifting

### Mobilité quotidienne
- 3-4 exercices clés à faire tous les jours

### Gestion fatigue & Déload
- Protocole déload semaine ${semaines}
- Signaux d'alerte à surveiller

### Conseils spécifiques
- 3-4 conseils clés pour progresser sur ce profil`;
}

export default function PowerliftingGenerator() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", age: "", gender: "Homme", weight: "",
    objectif_precis: "", objectif_custom: "",
    niveau: "", frequency: "4", semaines: "8", jours: [],
    squat: "", bench: "", deadlift: "",
    squat_freq: "2", bench_freq: "3", deadlift_freq: "1",
    squat_variants: [], bench_variants: [], deadlift_variants: [],
    upper_acc: [], lower_acc: [], injuries: "",
  });
  const [program, setProgram] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showExo, setShowExo] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleArr = (key, val) => setForm(f => ({
    ...f, [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val]
  }));

  const canProceed1 = form.niveau && form.objectif_precis;
  const canGenerate = form.weight && form.squat && form.bench && form.deadlift;

  const generateProgram = async () => {
    setLoading(true); setProgram(""); setStep(3); setProgress(0);
    const finalForm = {
      ...form,
      objectif_precis: form.objectif_precis === "Objectif personnalisé..." ? form.objectif_custom : form.objectif_precis
    };
    try {
      const r = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-5-20250929",
          max_tokens: 8000,
          messages: [{ role: "user", content: buildPrompt(finalForm) }]
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
              if (json.type === "content_block_delta" && json.delta?.text) {
                fullText += json.delta.text;
                setProgram(fullText);
                setProgress(Math.min(95, Math.round((fullText.length / 28000) * 100)));
              }
              if (json.type === "message_stop") setProgress(100);
            } catch {}
          }
        }
      }
      if (!fullText) setProgram("Erreur de connexion. Veuillez réessayer.");
      else setProgress(100);
    } catch { setProgram("Erreur de connexion. Veuillez réessayer."); }
    setLoading(false);
  };

  const exportPDF = () => {
    const finalForm = {
      ...form,
      objectif_precis: form.objectif_precis === "Objectif personnalisé..." ? form.objectif_custom : form.objectif_precis
    };
    setExportingPDF(true);
    setTimeout(() => {
      try {
        const printWindow = window.open("", "_blank", "width=900,height=700");
        const total = (parseInt(form.squat)||0)+(parseInt(form.bench)||0)+(parseInt(form.deadlift)||0);
        const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Programme Powerlifting - ${finalForm.name || "Athlète"}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 9.5pt; color: #1a1a1a; background: #fff; padding: 12mm 15mm; }
  @media print {
    body { padding: 8mm 10mm; font-size: 9pt; }
    .no-print { display: none !important; }
    h1.section { page-break-after: avoid; }
    h2.section { page-break-after: avoid; }
    table { page-break-inside: avoid; }
    tr { page-break-inside: avoid; }
  }
  .print-btn { position: fixed; top: 12px; right: 12px; background: #06b6d4; color: #fff; border: none; padding: 10px 22px; border-radius: 6px; font-size: 11pt; font-weight: 700; cursor: pointer; box-shadow: 0 3px 12px rgba(6,182,212,0.4); z-index: 9999; }
  .header { background: #07050f; padding: 14px 18px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid #06b6d4; }
  .header h1 { font-size: 20pt; font-weight: 900; color: #06b6d4; letter-spacing: 2px; }
  .header p { font-size: 7.5pt; color: #7dd3e0; margin-top: 2px; }
  .header-date { color: #7dd3e0; font-size: 7.5pt; text-align: right; }
  .profil { background: #f0f9ff; border: 1.5px solid #06b6d4; border-radius: 5px; padding: 8px 12px; margin-bottom: 10px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px 10px; }
  .profil-item label { font-size: 6.5pt; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; display: block; }
  .profil-item span { font-size: 8.5pt; font-weight: 700; color: #0f172a; }
  .total-badge { grid-column: span 4; background: #06b6d4; color: #fff; text-align: center; padding: 4px; border-radius: 3px; font-weight: 700; font-size: 9pt; letter-spacing: 1px; margin-top: 3px; }
  .objectif { background: #e0f7fa; border-left: 3px solid #06b6d4; padding: 5px 10px; margin-bottom: 10px; font-size: 8.5pt; }
  .objectif strong { color: #0284c7; }
  h1.section { background: #06b6d4; color: #fff; padding: 5px 10px; font-size: 11pt; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin: 12px 0 5px 0; }
  h2.section { background: #e0f7fa; border-left: 4px solid #06b6d4; color: #0369a1; padding: 4px 8px; font-size: 9.5pt; font-weight: 700; margin: 8px 0 4px 0; }
  h3.section { color: #0284c7; font-size: 8.5pt; font-weight: 700; margin: 6px 0 3px 0; padding-bottom: 2px; border-bottom: 1px solid #bae6fd; }
  table { width: 100%; border-collapse: collapse; margin: 3px 0 6px 0; font-size: 8pt; }
  th { background: #06b6d4; color: #fff; padding: 3.5px 5px; text-align: left; font-weight: 700; font-size: 7.5pt; }
  tr:nth-child(even) td { background: #f0f9ff; }
  td { padding: 3px 5px; border-bottom: 1px solid #e2e8f0; color: #1e293b; vertical-align: top; }
  ul { padding-left: 12px; margin: 2px 0 5px 0; }
  li { font-size: 8.5pt; color: #334155; margin-bottom: 1.5px; line-height: 1.5; }
  p { font-size: 8.5pt; color: #334155; line-height: 1.6; margin-bottom: 3px; }
  .sep { border: none; border-top: 1px solid #e0f7fa; margin: 6px 0; }
  strong { font-weight: 700; color: #0f172a; }
  .footer { margin-top: 15px; padding-top: 6px; border-top: 2px solid #06b6d4; display: flex; justify-content: space-between; color: #64748b; font-size: 7pt; }
</style>
</head>
<body>
<button class="no-print print-btn" onclick="window.print()">🖨️ Enregistrer en PDF</button>
<div class="header">
  <div><h1>LA FORGE AI</h1><p>Générateur Powerlifting — Programme personnalisé par IA</p></div>
  <div class="header-date">${new Date().toLocaleDateString("fr-FR", {day:"numeric",month:"long",year:"numeric"})}</div>
</div>
<div class="profil">
  <div class="profil-item"><label>Athlète</label><span>${finalForm.name || "—"}</span></div>
  <div class="profil-item"><label>Âge</label><span>${finalForm.age ? finalForm.age+" ans" : "—"}</span></div>
  <div class="profil-item"><label>Poids</label><span>${finalForm.weight ? finalForm.weight+" kg" : "—"}</span></div>
  <div class="profil-item"><label>Niveau</label><span>${finalForm.niveau || "—"}</span></div>
  <div class="profil-item"><label>Squat 1RM</label><span>${finalForm.squat ? finalForm.squat+" kg" : "—"}</span></div>
  <div class="profil-item"><label>Bench 1RM</label><span>${finalForm.bench ? finalForm.bench+" kg" : "—"}</span></div>
  <div class="profil-item"><label>Deadlift 1RM</label><span>${finalForm.deadlift ? finalForm.deadlift+" kg" : "—"}</span></div>
  <div class="profil-item"><label>Durée</label><span>${finalForm.semaines} semaines</span></div>
  ${total > 0 ? `<div class="total-badge">TOTAL : ${total} KG</div>` : ""}
</div>
${finalForm.objectif_precis ? `<div class="objectif"><strong>🎯 Objectif : </strong>${finalForm.objectif_precis}</div>` : ""}
<div id="content"></div>
<div class="footer">
  <span>La Forge AI — Programme Powerlifting généré par IA</span>
  <span>${finalForm.name || "Athlète"} | ${new Date().toLocaleDateString("fr-FR")}</span>
</div>
<script>
const prog = ${JSON.stringify(program)};
const lines = prog.split("\\n");
let html = "";
let inTable = false;
let tableRows = [];
let inList = false;

function flushTable() {
  if (!tableRows.length) return;
  html += "<table>";
  tableRows.forEach((row, ri) => {
    const tag = ri === 0 ? "th" : "td";
    html += "<tr>" + row.map(c => "<" + tag + ">" + c.trim().replace(/\\*\\*(.*?)\\*\\*/g, "<strong>$1</strong>") + "</" + tag + ">").join("") + "</tr>";
  });
  html += "</table>";
  tableRows = [];
  inTable = false;
}

function flushList() {
  if (inList) { html += "</ul>"; inList = false; }
}

for (const line of lines) {
  if (line.startsWith("|")) {
    flushList();
    const cells = line.split("|").filter((_, i, a) => i > 0 && i < a.length - 1);
    if (!cells.every(c => c.trim().match(/^[-:]+$/))) { tableRows.push(cells); inTable = true; }
    continue;
  }
  if (inTable) flushTable();
  if (!line.trim()) { flushList(); html += "<hr class='sep'>"; continue; }
  if (line.startsWith("# ")) { flushList(); html += "<h1 class='section'>" + line.slice(2) + "</h1>"; continue; }
  if (line.startsWith("## ")) { flushList(); html += "<h2 class='section'>" + line.slice(3) + "</h2>"; continue; }
  if (line.startsWith("### ")) { flushList(); html += "<h3 class='section'>" + line.slice(4) + "</h3>"; continue; }
  if (line.startsWith("- ") || line.startsWith("* ")) {
    if (!inList) { html += "<ul>"; inList = true; }
    html += "<li>" + line.slice(2).replace(/\\*\\*(.*?)\\*\\*/g, "<strong>$1</strong>") + "</li>";
    continue;
  }
  flushList();
  const formatted = line.replace(/\\*\\*(.*?)\\*\\*/g, "<strong>$1</strong>");
  html += "<p>" + formatted + "</p>";
}
if (inTable) flushTable();
flushList();
document.getElementById("content").innerHTML = html;
<\/script>
</body>
</html>`;
        printWindow.document.write(htmlContent);
        printWindow.document.close();
      } catch(e) {
        alert("Erreur : " + e.message);
      }
      setExportingPDF(false);
    }, 100);
  };

  const reset = () => { setStep(1); setProgram(""); setProgress(0); };

  const renderMD = (text) => text.split("\n").map((line, i) => {
    if (line.startsWith("# ")) return <h1 key={i} style={{ color: C, fontSize: "1.3rem", fontFamily: "'Bebas Neue',cursive", marginTop: "1.5rem", borderBottom: `2px solid ${C}`, paddingBottom: "0.3rem" }}>{line.slice(2)}</h1>;
    if (line.startsWith("## ")) return <h2 key={i} style={{ color: C, fontSize: "1.05rem", marginTop: "1.2rem", fontWeight: 700 }}>{line.slice(3)}</h2>;
    if (line.startsWith("### ")) return <h3 key={i} style={{ color: "#67e8f9", fontSize: "0.95rem", marginTop: "0.8rem", fontWeight: 600 }}>{line.slice(4)}</h3>;
    if (line.startsWith("- ") || line.startsWith("* ")) return <div key={i} style={{ display: "flex", gap: "0.5rem", margin: "0.2rem 0" }}><span style={{ color: C, fontSize: "0.5rem", marginTop: "0.4rem" }}>◆</span><span style={{ color: "#cffafe", fontSize: "0.88rem", lineHeight: 1.7 }}>{line.slice(2)}</span></div>;
    if (line.startsWith("|")) {
      const cells = line.split("|").filter((_, i, a) => i > 0 && i < a.length - 1);
      if (cells.every(c => c.trim().match(/^[-:]+$/))) return null;
      return <div key={i} style={{ display: "grid", gridTemplateColumns: `repeat(${cells.length}, 1fr)`, gap: "1px", marginBottom: "1px" }}>{cells.map((cell, ci) => <div key={ci} style={{ background: "#0c1a20", padding: "0.3rem 0.5rem", fontSize: "0.75rem", color: "#a5f3fc", borderLeft: ci === 0 ? `2px solid ${C}` : "none" }}>{cell.trim()}</div>)}</div>;
    }
    if (!line.trim()) return <br key={i} />;
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return <p key={i} style={{ color: "#a5f3fc80", fontSize: "0.88rem", lineHeight: 1.8, margin: "0.15rem 0" }}>{parts.map((p, j) => j % 2 === 1 ? <strong key={j} style={{ color: "#e0f7fa" }}>{p}</strong> : p)}</p>;
  });

  const chip = (active) => ({ padding: "0.45rem 0.75rem", borderRadius: 8, cursor: "pointer", fontSize: "0.82rem", fontFamily: "inherit", transition: "all 0.15s", background: active ? `${C}22` : "#0a0814", color: active ? C : "#4a6070", border: `1px solid ${active ? C : "#1a2535"}`, fontWeight: active ? 700 : 400 });
  const lbl = { display: "block", fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#2a4050", marginBottom: "0.4rem" };
  const inp = { width: "100%", background: "#0a0814", border: "1px solid #1a2535", borderRadius: 8, padding: "0.6rem 0.8rem", color: "#cffafe", fontSize: "0.88rem", outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
  const pBtn = (disabled) => ({ width: "100%", padding: "0.85rem", borderRadius: 10, fontFamily: "'Bebas Neue',cursive", letterSpacing: "0.12em", fontSize: "1.05rem", border: "none", cursor: disabled ? "not-allowed" : "pointer", background: disabled ? "#0a1520" : `linear-gradient(135deg, ${C}, #0891b2)`, color: disabled ? "#1a3040" : "#07050f", fontWeight: 700, boxShadow: disabled ? "none" : `0 4px 20px ${C}44` });
  const card = { padding: "1rem", background: "#080612", borderRadius: 10, border: "1px solid #1a2535", marginBottom: "1rem" };

  const FreqRow = ({ label: l, field, opts = ["1","2","3","4"] }) => (
    <div style={{ marginBottom: "0.8rem" }}>
      <label style={lbl}>{l}</label>
      <div style={{ display: "flex", gap: "0.4rem" }}>
        {opts.map(o => <button key={o} onClick={() => update(field, o)} style={{ ...chip(form[field] === o), flex: 1 }}>{o}x</button>)}
      </div>
    </div>
  );

  const ChipGroup = ({ label: l, field, options }) => (
    <div style={{ marginBottom: "0.8rem" }}>
      <label style={lbl}>{l}</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
        {options.map(o => <button key={o} onClick={() => toggleArr(field, o)} style={{ ...chip(form[field]?.includes(o)), fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}>{o}</button>)}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#07050f", fontFamily: "'DM Sans',sans-serif", color: "#cffafe", display: "flex", flexDirection: "column", alignItems: "center", padding: "1.5rem 1rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700&display=swap" rel="stylesheet" />
      <style>{`input::placeholder{color:#1a3040}input:focus{border-color:${C}!important}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#0e4a5a;border-radius:2px}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* HEADER */}
      <div style={{ width: "100%", maxWidth: 680, marginBottom: "1.5rem" }}>
        <div style={{ fontSize: "0.6rem", letterSpacing: "0.3em", color: C, textTransform: "uppercase" }}>La Forge AI</div>
        <h1 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "2.4rem", letterSpacing: "0.06em", margin: 0, color: "#fff", lineHeight: 1 }}>
          POWERLIFTING<span style={{ color: C }}> GENERATOR</span>
        </h1>
        <p style={{ color: "#1a4050", fontSize: "0.82rem", marginTop: "0.3rem" }}>Programme SBD personnalisé par IA • Squat / Bench / Deadlift</p>
      </div>

      <div style={{ width: "100%", maxWidth: 680 }}>
        {/* STEPPER */}
        {step < 3 && (
          <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.5rem", alignItems: "center" }}>
            {[1, 2].map(s => (<div key={s} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: step >= s ? C : "#0a0814", color: step >= s ? "#07050f" : "#1a3040", fontWeight: 700, fontSize: "0.8rem", border: `1px solid ${step >= s ? C : "#1a2535"}` }}>{s}</div>
              {s < 2 && <div style={{ width: 40, height: 2, background: step > s ? C : "#1a2535" }} />}
            </div>))}
            <span style={{ marginLeft: "0.5rem", fontSize: "0.78rem", color: "#1a4050" }}>{step === 1 ? "Programme & Objectifs" : "Profil & 1RM"}</span>
          </div>
        )}

        <div style={{ background: "#080612", border: "1px solid #1a2535", borderRadius: 16, padding: "1.75rem", boxShadow: `0 20px 60px rgba(6,182,212,0.08)`, animation: "fadeIn 0.3s ease" }}>

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <h2 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "1.4rem", color: C, marginTop: 0 }}>Programme & Objectifs</h2>

              <label style={lbl}>Objectif précis</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "1.2rem" }}>
                {OBJECTIFS_PRECIS.map(o => <button key={o} onClick={() => update("objectif_precis", o)} style={{ ...chip(form.objectif_precis === o), textAlign: "left", fontSize: "0.82rem" }}>{form.objectif_precis === o ? "▶ " : "○ "}{o}</button>)}
              </div>
              {form.objectif_precis === "Objectif personnalisé..." && (
                <input style={{ ...inp, marginBottom: "1.2rem" }} placeholder="Ex: Passer mon total de 500 à 600 kg en 16 semaines..." value={form.objectif_custom} onChange={e => update("objectif_custom", e.target.value)} />
              )}

              <label style={lbl}>Niveau</label>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.2rem" }}>
                {NIVEAUX.map(n => <button key={n} onClick={() => update("niveau", n)} style={{ ...chip(form.niveau === n), flex: 1 }}>{n}</button>)}
              </div>

              <label style={lbl}>Séances / semaine</label>
              <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.2rem" }}>
                {FREQUENCES.map(f => <button key={f} onClick={() => update("frequency", f)} style={{ ...chip(form.frequency === f), flex: 1 }}>{f}x</button>)}
              </div>

              <label style={lbl}>Durée du programme</label>
              <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.2rem" }}>
                {SEMAINES.map(s => <button key={s} onClick={() => update("semaines", s)} style={{ ...chip(form.semaines === s), flex: 1 }}>{s} sem</button>)}
              </div>

              <div style={card}>
                <label style={{ ...lbl, color: C, marginBottom: "0.8rem" }}>📅 Jours souhaités (optionnel)</label>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  {JOURS.map(j => <button key={j} onClick={() => toggleArr("jours", j)} style={{ ...chip(form.jours.includes(j)), flex: 1, minWidth: "2.5rem" }}>{j}</button>)}
                </div>
              </div>

              <div style={card}>
                <label style={{ ...lbl, color: C, marginBottom: "0.8rem" }}>🏋️ Fréquence par mouvement</label>
                <FreqRow label="Squat (x/semaine)" field="squat_freq" />
                <FreqRow label="Bench Press (x/semaine)" field="bench_freq" />
                <FreqRow label="Deadlift (x/semaine)" field="deadlift_freq" />
              </div>

              <button onClick={() => setStep(2)} disabled={!canProceed1} style={pBtn(!canProceed1)}>Continuer →</button>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <h2 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "1.4rem", color: C, marginTop: 0 }}>Profil & 1RM</h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", marginBottom: "1rem" }}>
                {[["Prénom", "name", "text", "Alex"], ["Âge", "age", "number", "25"], ["Poids kg", "weight", "number", "90"]].map(([l, key, type, ph]) => (
                  <div key={key}><label style={lbl}>{l}</label><input style={inp} type={type} placeholder={ph} value={form[key]} onChange={e => update(key, e.target.value)} /></div>
                ))}
                <div><label style={lbl}>Genre</label><div style={{ display: "flex", gap: "0.5rem" }}>{["Homme", "Femme"].map(g => <button key={g} onClick={() => update("gender", g)} style={{ ...chip(form.gender === g), flex: 1 }}>{g}</button>)}</div></div>
              </div>

              <div style={card}>
                <label style={{ ...lbl, color: C, marginBottom: "0.8rem" }}>1RM actuels *</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.6rem" }}>
                  {[["Squat kg", "squat"], ["Bench kg", "bench"], ["Deadlift kg", "deadlift"]].map(([l, key]) => (
                    <div key={key}><label style={lbl}>{l}</label><input style={inp} type="number" placeholder="0" value={form[key]} onChange={e => update(key, e.target.value)} /></div>
                  ))}
                </div>
                {form.squat && form.bench && form.deadlift && (
                  <div style={{ marginTop: "0.8rem", padding: "0.6rem", background: `${C}15`, borderRadius: 8, textAlign: "center", fontSize: "0.88rem", color: C, fontWeight: 700 }}>
                    Total : {(parseInt(form.squat)||0)+(parseInt(form.bench)||0)+(parseInt(form.deadlift)||0)} kg
                  </div>
                )}
              </div>

              <div style={card}>
                <button onClick={() => setShowExo(!showExo)} style={{ background: "none", border: "none", cursor: "pointer", color: C, fontFamily: "inherit", fontSize: "0.88rem", fontWeight: 700, padding: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {showExo ? "▼" : "▶"} Variantes & accessoires (optionnel)
                </button>
                {showExo && (
                  <div style={{ marginTop: "1rem" }}>
                    <ChipGroup label="Variantes Squat" field="squat_variants" options={SQUAT_VARIANTS} />
                    <ChipGroup label="Variantes Bench" field="bench_variants" options={BENCH_VARIANTS} />
                    <ChipGroup label="Variantes Deadlift" field="deadlift_variants" options={DEADLIFT_VARIANTS} />
                    <ChipGroup label="Accessoires haut du corps" field="upper_acc" options={ACC_UPPER} />
                    <ChipGroup label="Accessoires bas du corps" field="lower_acc" options={ACC_LOWER} />
                  </div>
                )}
              </div>

              <div style={{ marginBottom: "1.2rem" }}>
                <label style={lbl}>Blessures / contraintes</label>
                <input style={inp} placeholder="Genou fragile, douleur épaule..." value={form.injuries} onChange={e => update("injuries", e.target.value)} />
              </div>

              <div style={{ display: "flex", gap: "0.6rem" }}>
                <button onClick={() => setStep(1)} style={{ ...pBtn(false), background: "#0a0814", boxShadow: "none", border: "1px solid #1a2535", color: "#2a4050", flex: "0 0 auto", width: "auto", padding: "0.85rem 1.4rem" }}>←</button>
                <button onClick={generateProgram} disabled={!canGenerate} style={{ ...pBtn(!canGenerate), flex: 1, width: "auto" }}>🔨 Générer le programme</button>
              </div>
            </>
          )}

          {/* STEP 3 — RÉSULTAT */}
          {step === 3 && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
                <h2 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "1.4rem", color: C, margin: 0 }}>Programme Powerlifting</h2>
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
                    <span style={{ fontSize: "0.78rem", color: "#1a6070" }}>🔨 Génération en cours...</span>
                    <span style={{ fontSize: "0.78rem", color: C, fontWeight: 700 }}>{progress}%</span>
                  </div>
                  <div style={{ height: 6, background: "#0a0814", borderRadius: 4, overflow: "hidden", border: "1px solid #1a2535" }}>
                    <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${C}, #0891b2)`, borderRadius: 4, transition: "width 0.4s ease" }} />
                  </div>
                </div>
              )}

              {loading && !program && (
                <div style={{ textAlign: "center", padding: "2rem 0" }}>
                  <div style={{ fontSize: "2.5rem", animation: "pulse 1.2s infinite" }}>🔨</div>
                  <p style={{ color: "#1a4050", marginTop: "1rem", fontSize: "0.88rem" }}>Connexion à l'IA...</p>
                </div>
              )}

              {program && (
                <>
                  {!loading && (
                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                      {[form.niveau, form.objectif_precis !== "Objectif personnalisé..." ? form.objectif_precis : form.objectif_custom, `${form.frequency}x/sem`, `${form.semaines} sem`].filter(Boolean).map((tag, i) => (
                        <span key={i} style={{ padding: "0.2rem 0.7rem", background: `${C}15`, border: `1px solid ${C}40`, borderRadius: 20, fontSize: "0.75rem", color: C }}>{tag}</span>
                      ))}
                    </div>
                  )}
                  <div style={{ background: "#050810", border: "1px solid #1a2535", borderRadius: 10, padding: "1.25rem", maxHeight: "55vh", overflowY: "auto" }}>
                    {renderMD(program)}
                  </div>
                  {!loading && <div style={{ marginTop: "0.75rem", padding: "0.5rem 1rem", background: "#050e12", borderRadius: 8, border: "1px solid #0e3040", fontSize: "0.75rem", color: "#1a6070" }}>Programme généré par IA — à affiner selon les retours de l'athlète</div>}
                </>
              )}
            </>
          )}
        </div>
      </div>
      <p style={{ color: "#050810", fontSize: "0.7rem", marginTop: "1.5rem" }}>La Forge AI · Propulsé par Claude · Anthropic</p>
    </div>
  );
}
