/*
 * Uuendab euribor-data.json faili euribor-rates.eu andmetega (päevased väärtused).
 * Jookseb GitHub Actionsis (Node 20+, native fetch, ilma sõltuvusteta).
 *
 * OLULINE: see skript uuendab ainult PÄEVAST aegrida. EI puuduta "historico"
 * välja (kuukeskmised), mida hallatakse eraldi.
 *
 * NB: andmeid loetakse euribor-rates.eu portugalikeelselt lehelt, sest
 * parsimine sõltub selle lehe URL-i fragmentidest ("euribor-taxa-...") ja
 * kuupäevaformaadist (pp/kk/aaaa). Euribori väärtused on kõikjal samad,
 * seega lehe keel ei mõjuta andmeid.
 */

import { readFileSync, writeFileSync } from "node:fs";

const CURRENT_URL = "https://www.euribor-rates.eu/pt/taxas-euribor-actuais/";
const DATA_PATH = new URL("../euribor-data.json", import.meta.url);

const MESES = ["jaanuar","veebruar","märts","aprill","mai","juuni","juuli","august","september","oktoober","november","detsember"];
const UA = { headers: { "User-Agent": "Mozilla/5.0 (Rahatarkus Euribor bot; +https://www.rahatarkus.ee)" } };

function toNum(s) {
  return parseFloat(String(s).replace("%", "").trim().replace(/\s/g, "").replace(",", "."));
}

async function getHtml(url) {
  const r = await fetch(url, UA);
  if (!r.ok) throw new Error(`HTTP ${r.status} lehel ${url}`);
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
  if (!date || !m3 || !m6 || !m12) throw new Error("Päevaseid väärtusi ei õnnestunud lugeda (kas lehe struktuur muutus?)");

  const novo = { d: date.d, m3: m3[0], m6: m6[0], m12: m12[0] };
  const jaTem = data.serie.some((r) => r.d === novo.d);
  if (!jaTem) {
    data.serie.push(novo);
    data.serie.sort((a, b) => a.d.split("/").reverse().join("").localeCompare(b.d.split("/").reverse().join("")));
    data.serie = data.serie.slice(-45);
  }
  data.dataReferencia = `${parseInt(date.dd, 10)}. ${MESES[parseInt(date.mm, 10) - 1]} ${date.yyyy}`;

  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log(`[euribor] OK -> ${data.dataReferencia} | 3k ${novo.m3} 6k ${novo.m6} 12k ${novo.m12}${jaTem ? " (oli juba olemas)" : ""}`);
}

main().catch((e) => { console.error("[euribor] EBAÕNNESTUS:", e.message); process.exit(1); });
