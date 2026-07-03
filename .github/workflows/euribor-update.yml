/*
 * Atualiza euribor-data.json a partir do euribor-rates.eu (valores diarios).
 * Corre no GitHub Actions (Node 20+, fetch nativo, sem dependencias).
 *
 * IMPORTANTE: este script so atualiza a serie DIARIA. NAO toca no "historico"
 * (medias mensais), que agora vem do Banco de Portugal / BPstat e e mantido a parte.
 */

import { readFileSync, writeFileSync } from "node:fs";

const CURRENT_URL = "https://www.euribor-rates.eu/pt/taxas-euribor-actuais/";
const DATA_PATH = new URL("../euribor-data.json", import.meta.url);

const MESES = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
const UA = { headers: { "User-Agent": "Mozilla/5.0 (LiteraciaFinanceira Euribor bot; +https://www.literaciafinanceira.pt)" } };

function toNum(s) {
  return parseFloat(String(s).replace("%", "").trim().replace(/\s/g, "").replace(",", "."));
}

async function getHtml(url) {
  const r = await fetch(url, UA);
  if (!r.ok) throw new Error(`HTTP ${r.status} em ${url}`);
  return r.text();
}

function rowValues(html, slugFragment) {
  for (const tr of html.split(/<tr[\s>]/i)) {
    if (tr.includes(slugFragment)) {
      const vals = [...tr.matchAll(/(-?\d+,\d+)\s*%/g)].map((m) => toNum(m[1]));
      if (vals.length) return vals;
    }
  }
  return null;
}

function firstDate(html) {
  const m = html.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (!m) return null;
  return { d: `${m[1]}/${m[2]}/${m[3]}`, dd: m[1], mm: m[2], yyyy: m[3] };
}

async function main() {
  const data = JSON.parse(readFileSync(DATA_PATH, "utf8"));

  const cur = await getHtml(CURRENT_URL);
  const date = firstDate(cur);
  const m3 = rowValues(cur, "euribor-taxa-3-meses");
  const m6 = rowValues(cur, "euribor-taxa-6-meses");
  const m12 = rowValues(cur, "euribor-taxa-12-meses");
  if (!date || !m3 || !m6 || !m12) throw new Error("Nao consegui ler os valores diarios (layout mudou?)");

  const novo = { d: date.d, m3: m3[0], m6: m6[0], m12: m12[0] };
  const jaTem = data.serie.some((r) => r.d === novo.d);
  if (!jaTem) {
    data.serie.push(novo);
    data.serie.sort((a, b) => a.d.split("/").reverse().join("").localeCompare(b.d.split("/").reverse().join("")));
    data.serie = data.serie.slice(-45);
  }
  data.dataReferencia = `${parseInt(date.dd, 10)} de ${MESES[parseInt(date.mm, 10) - 1]} de ${date.yyyy}`;

  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log(`[euribor] OK -> ${data.dataReferencia} | 3m ${novo.m3} 6m ${novo.m6} 12m ${novo.m12}${jaTem ? " (ja existia)" : ""}`);
}

main().catch((e) => { console.error("[euribor] FALHOU:", e.message); process.exit(1); });
