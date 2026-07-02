/*
 * Atualiza euribor-data.json a partir do euribor-rates.eu.
 * Corre no GitHub Actions (Node 20+, usa fetch nativo, sem dependencias).
 *
 * O que faz:
 *  1. Le a pagina "taxas Euribor actuais" (ultimos dias uteis, com 24h de desfasamento).
 *  2. Acrescenta o dia mais recente a "serie" (dedup por data), mantendo os ultimos 45.
 *  3. Atualiza "dataReferencia".
 *  4. Le a pagina do ano atual e faz upsert dos valores mensais em "historico" (ultimos 14 meses).
 *
 * NOTA: os dados do euribor-rates.eu tem 24h de desfasamento imposto pelo EMMI e sao para uso
 * nao-comercial. Confirma o licenciamento antes de usar comercialmente (ver README).
 * O parsing e por natureza fragil; se a fonte mudar de layout, o script FALHA (throw) de proposito,
 * para nao escrever dados errados.
 */

import { readFileSync, writeFileSync } from "node:fs";

const CURRENT_URL = "https://www.euribor-rates.eu/pt/taxas-euribor-actuais/";
const YEAR_URL = (y) => `https://www.euribor-rates.eu/pt/taxas-euribor-por-ano/${y}/`;
const DATA_PATH = new URL("../euribor-data.json", import.meta.url);

const MESES = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];

const UA = { headers: { "User-Agent": "Mozilla/5.0 (LiteraciaFinanceira Euribor bot; +https://www.literaciafinanceira.pt)" } };

function toNum(s) {
  // "2,324 %" -> 2.324   |   "-0,570 %" -> -0.57
  return parseFloat(String(s).replace("%", "").trim().replace(/\s/g, "").replace(",", "."));
}

async function getHtml(url) {
  const r = await fetch(url, UA);
  if (!r.ok) throw new Error(`HTTP ${r.status} em ${url}`);
  return r.text();
}

/* Valores (na ordem em que aparecem) da <tr> que contem um dado fragmento de href. */
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
  const m = html.match(/(\d{2})\/(\d{2})\/(\d{4})/); // a data mais recente aparece primeiro na tabela
  if (!m) return null;
  return { d: `${m[1]}/${m[2]}/${m[3]}`, dd: m[1], mm: m[2], yyyy: m[3] };
}

/* Linhas mensais (1o dia util de cada mes) da pagina de um ano: colunas = 1sem,1mes,3m,6m,12m */
function yearMonthly(html) {
  const rows = [];
  for (const tr of html.split(/<tr[\s>]/i)) {
    const d = tr.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    if (!d) continue;
    const vals = [...tr.matchAll(/(-?\d+,\d+)\s*%/g)].map((m) => toNum(m[1]));
    if (vals.length >= 5) rows.push({ d: `${d[3]}-${d[2]}`, m3: vals[2], m6: vals[3], m12: vals[4] });
  }
  return rows;
}

async function main() {
  const data = JSON.parse(readFileSync(DATA_PATH, "utf8"));

  // 1) valores diarios mais recentes
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
    // ordenar por data e manter os ultimos 45
    data.serie.sort((a, b) => a.d.split("/").reverse().join("").localeCompare(b.d.split("/").reverse().join("")));
    data.serie = data.serie.slice(-45);
  }
  data.dataReferencia = `${parseInt(date.dd, 10)} de ${MESES[parseInt(date.mm, 10) - 1]} de ${date.yyyy}`;

  // 2) historico mensal (upsert do ano atual)
  try {
    const yhtml = await getHtml(YEAR_URL(date.yyyy));
    const meses = yearMonthly(yhtml);
    const byKey = new Map(data.historico.map((r) => [r.d, r]));
    for (const r of meses) byKey.set(r.d, r);
    data.historico = [...byKey.values()]
      .sort((a, b) => a.d.localeCompare(b.d))
      .slice(-14);
  } catch (e) {
    console.warn("[euribor] aviso: nao atualizei o historico mensal:", e.message);
  }

  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log(`[euribor] OK -> ${data.dataReferencia} | 3m ${novo.m3} 6m ${novo.m6} 12m ${novo.m12}`);
}

main().catch((e) => { console.error("[euribor] FALHOU:", e.message); process.exit(1); });

