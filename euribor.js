/* =====================================================================
   LiteraciaFinanceira.pt - Ferramenta "Euribor hoje" (bundle externo)
   Injeta CSS + HTML no #lfc-eur e vai buscar os dados a euribor-data.json.
   ===================================================================== */
(function(){
  "use strict";

  var DATA_URL = "https://cdn.jsdelivr.net/gh/franklinsilvapt-arch/euribor-hoje@main/euribor-data.json";

  var CSS = `/* ===================== LFC-EUR · estilos (tokens LF) ===================== */
#lfc-eur{ font-family:inherit; color:#202432; -webkit-font-smoothing:antialiased; }
#lfc-eur *{ box-sizing:border-box; }
#lfc-eur a{ text-decoration:none; }

.lfc-eur-h1{ font-family:inherit; font-weight:700; font-size:48px; line-height:1.08; letter-spacing:-0.02em; color:#202432; margin:16px 0 0; }
.lfc-eur-sub{ font-size:18px; line-height:1.6; color:#3A4454; margin:16px 0 0; max-width:680px; letter-spacing:-0.1px; }
.lfc-eur-refline{ margin:16px 0 0; font-size:14px; line-height:1.55; color:#4F5969; font-weight:500; max-width:820px; }
.lfc-eur-refline strong{ color:#202432; }

/* Cards */
.lfc-eur-cards{ display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:16px; margin-top:28px; }
.lfc-eur-card{ background:#fff; border:1px solid #E9ECF1; border-radius:12px; padding:22px 18px; box-shadow:0 1px 3px rgba(18,23,33,0.06); min-width:0; }
.lfc-eur-card-top{ display:flex; align-items:center; gap:8px; }
.lfc-eur-card-label{ font-weight:700; font-size:13px; letter-spacing:0.04em; text-transform:uppercase; color:#4F5969; white-space:nowrap; }
.lfc-eur-card-bar{ width:17px; height:5px; border-radius:999px; flex:none; }
.lfc-eur-card-valrow{ display:flex; align-items:center; justify-content:space-between; gap:10px; margin-top:16px; flex-wrap:wrap; }
.lfc-eur-card-val{ font-size:30px; font-weight:700; letter-spacing:-0.02em; color:#202432; font-variant-numeric:tabular-nums; line-height:1; }
.lfc-eur-card-delta{ display:inline-flex; align-items:center; gap:4px; font-size:13px; font-weight:600; padding:4px 10px; border-radius:999px; font-variant-numeric:tabular-nums; white-space:nowrap; flex:0 0 auto; }
.lfc-eur-card-foot{ margin-top:18px; border-top:1px solid #F2F4F7; padding-top:14px; display:flex; flex-direction:column; gap:9px; }
.lfc-eur-card-line{ display:flex; align-items:baseline; justify-content:space-between; gap:8px; font-size:13px; }
.lfc-eur-card-line .k{ color:#4F5969; white-space:nowrap; }
.lfc-eur-card-line .v{ color:#394455; font-weight:600; font-variant-numeric:tabular-nums; display:inline-flex; align-items:baseline; gap:6px; white-space:nowrap; }
.lfc-eur-card-mdelta{ font-size:12px; font-weight:600; }

.lfc-eur-note{ font-size:13px; line-height:1.55; color:#98A2B3; margin:16px 0 0; max-width:820px; }

/* Blocos genericos */
.lfc-eur-block{ margin-top:48px; }
.lfc-eur-block-head{ display:flex; align-items:flex-end; justify-content:space-between; flex-wrap:wrap; gap:14px; margin-bottom:18px; }
.lfc-eur-eyebrow{ font-weight:700; font-size:13px; letter-spacing:0.06em; text-transform:uppercase; color:#FF5A1F; }
.lfc-eur-h2{ font-family:inherit; font-weight:700; font-size:30px; line-height:1.15; letter-spacing:-0.02em; color:#202432; margin:6px 0 0; }

/* Media mensal */
.lfc-eur-mm-cards{ display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:16px; }
.lfc-eur-mm-card{ background:#FCFCFD; border:1px solid #E9ECF1; border-radius:12px; padding:18px 18px; min-width:0; }
.lfc-eur-mm-card .lbl{ font-weight:700; font-size:12px; letter-spacing:0.04em; text-transform:uppercase; color:#4F5969; }
.lfc-eur-mm-card .val{ font-size:26px; font-weight:700; letter-spacing:-0.02em; color:#202432; font-variant-numeric:tabular-nums; margin-top:6px; line-height:1; }
.lfc-eur-mm-cap{ display:inline-block; margin:14px 0 0; font-size:12px; font-weight:600; color:#C72307; background:#FFF4ED; border:1px solid #FFE7D4; border-radius:999px; padding:5px 12px; line-height:1.4; }

/* Tabela */
.lfc-eur-table-wrap{ border:1px solid #E9ECF1; border-radius:12px; overflow:hidden; }
.lfc-eur-table{ width:100%; border-collapse:collapse; font-size:14px; }
.lfc-eur-table thead tr{ background:#FCFCFD; border-bottom:1px solid #EAECF0; }
.lfc-eur-table th{ text-align:right; padding:13px 16px; font-weight:600; font-size:12px; letter-spacing:0.04em; text-transform:uppercase; color:#4F5969; }
.lfc-eur-table th.lfc-eur-th-left{ text-align:left; padding-left:24px; }
.lfc-eur-table th.lfc-eur-th-right{ padding-right:24px; }
.lfc-eur-table td{ padding:12px 16px; text-align:right; font-variant-numeric:tabular-nums; color:#394455; border-bottom:1px solid #F2F4F7; }
.lfc-eur-table td.lfc-eur-td-date{ text-align:left; padding-left:24px; white-space:nowrap; color:#394455; }
.lfc-eur-table td.lfc-eur-td-last{ padding-right:24px; }
.lfc-eur-table tr.is-today td{ background:#FFF9F5; font-weight:700; color:#202432; }
.lfc-eur-table tr[data-extra]{ display:none; }
.lfc-eur-table tr[data-extra].is-shown{ display:table-row; }
.lfc-eur-morebtn{ display:inline-flex; align-items:center; gap:8px; margin-top:14px; font-size:14px; font-weight:600; color:#4F5969; border:1px solid #D0D5DD; border-radius:10px; padding:9px 16px; }
.lfc-eur-morebtn:hover{ border-color:#98A2B3; }

/* Grafico */
.lfc-eur-ranges{ display:flex; gap:4px; background:#F2F4F7; border:1px solid #EAECF0; border-radius:12px; padding:4px; }
.lfc-eur-ranges button{ border:0; background:transparent; font-family:inherit; font-size:13px; font-weight:600; color:#4F5969; padding:7px 14px; border-radius:9px; cursor:pointer; letter-spacing:-0.1px; }
.lfc-eur-ranges button.is-active{ background:#fff; color:#202432; box-shadow:0 1px 2px rgba(18,23,33,0.10); }
.lfc-eur-chartcard{ background:#fff; border:1px solid #E9ECF1; border-radius:12px; padding:22px 22px 14px; box-shadow:0 1px 3px rgba(18,23,33,0.06); }
.lfc-eur-legend{ display:flex; align-items:center; gap:20px; margin-bottom:10px; font-size:13px; font-weight:600; color:#394455; flex-wrap:wrap; }
.lfc-eur-legend .lg{ display:inline-flex; align-items:center; gap:7px; cursor:pointer; user-select:none; }
.lfc-eur-legend .lg .dot{ width:11px; height:11px; border-radius:50%; }
.lfc-eur-legend .lg.is-off{ color:#98A2B3; text-decoration:line-through; }
.lfc-eur-canvas-wrap{ position:relative; height:340px; }

/* Simulador */
.lfc-eur-sim{ margin-top:52px; }
.lfc-eur-sim-eyebrow{ font-weight:700; font-size:13px; letter-spacing:0.06em; text-transform:uppercase; color:#FF5A1F; }
.lfc-eur-sim-h2{ font-family:inherit; font-weight:700; font-size:30px; line-height:1.2; letter-spacing:-0.02em; color:#202432; margin:6px 0 6px; }
.lfc-eur-sim-sub{ font-size:15px; line-height:1.6; color:#4F5969; margin:0 0 24px; max-width:620px; }
.lfc-eur-sim-grid{ display:grid; grid-template-columns:1.1fr 0.9fr; gap:20px; align-items:stretch; }
.lfc-eur-sim-inputs{ background:#fff; border:1px solid #E9ECF1; border-radius:16px; padding:26px 24px; box-shadow:0 1px 3px rgba(18,23,33,0.06); display:flex; flex-direction:column; gap:18px; }
.lfc-eur-sim-two{ display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.lfc-eur-sim-field label{ display:block; font-size:13px; font-weight:600; color:#4F5969; margin-bottom:8px; }
.lfc-eur-sim-field input{ width:100%; background:#fff; border:1px solid #D0D5DD; border-radius:12px; padding:13px 15px; color:#202432; font-size:16px; font-weight:600; outline:none; font-variant-numeric:tabular-nums; font-family:inherit; }
.lfc-eur-sim-field input:focus{ border-color:var(--colors--accent-blue,#2E90FA); }
.lfc-eur-sim-pills{ display:flex; gap:8px; }
.lfc-eur-sim-pills button{ flex:1; background:#F2F4F7; border:1px solid #EAECF0; color:#4F5969; font-family:inherit; font-size:14px; font-weight:600; padding:12px 8px; border-radius:12px; cursor:pointer; }
.lfc-eur-sim-pills button.is-active{ background:#FFF4ED; border-color:#FF5A1F; color:#C72307; }
.lfc-eur-sim-result{ background:#121721; border-radius:16px; padding:26px 24px; display:flex; flex-direction:column; gap:16px; color:#fff; }
.lfc-eur-sim-row{ display:flex; align-items:center; justify-content:space-between; font-size:14px; }
.lfc-eur-sim-row span:first-child{ color:rgba(255,255,255,0.6); }
.lfc-eur-sim-row span:last-child{ font-weight:600; color:#fff; font-variant-numeric:tabular-nums; }
.lfc-eur-sim-row--tan{ border-top:1px solid #2B3140; padding-top:14px; }
.lfc-eur-sim-row--tan span:last-child{ color:#FFA570; font-weight:700; }
.lfc-eur-sim-prest{ border-top:1px solid #2B3140; padding-top:16px; }
.lfc-eur-sim-prest-label{ display:block; font-size:13px; color:rgba(255,255,255,0.6); margin-bottom:4px; }
.lfc-eur-sim-prest-val{ font-family:inherit; font-weight:700; font-size:40px; line-height:1; color:#fff; font-variant-numeric:tabular-nums; letter-spacing:-0.02em; }
.lfc-eur-sim-shock{ background:rgba(240,68,56,0.14); border:1px solid rgba(253,162,155,0.25); border-radius:12px; padding:12px 14px; font-size:13px; line-height:1.45; color:#FDA29B; }
.lfc-eur-sim-shock strong{ color:#fff; }
.lfc-eur-sim-foot{ font-size:12px; line-height:1.55; color:#98A2B3; margin:22px 0 0; }
.lfc-eur-sim-link{ color:var(--colors--accent-blue,#2E90FA); text-decoration:underline; }


/* ---------- Responsivo ---------- */
@media (max-width:767px){
  .lfc-eur-h1{ font-size:36px; }
  .lfc-eur-sub{ font-size:16px; }
  .lfc-eur-cards{ grid-template-columns:1fr; gap:14px; }
  .lfc-eur-h2, .lfc-eur-sim-h2{ font-size:25px; }
  .lfc-eur-sim-grid{ grid-template-columns:1fr; gap:22px; }
  .lfc-eur-sim-prest-val{ font-size:34px; }
  .lfc-eur-canvas-wrap{ height:280px; }
  .lfc-eur-table th, .lfc-eur-table td{ padding:11px 12px; }
  .lfc-eur-table th.lfc-eur-th-left, .lfc-eur-table td.lfc-eur-td-date{ padding-left:16px; }
  .lfc-eur-table th.lfc-eur-th-right, .lfc-eur-table td.lfc-eur-td-last{ padding-right:16px; }
  .lfc-eur-mm-cards{ grid-template-columns:1fr; gap:10px; }
  .lfc-eur-mm-card{ display:flex; align-items:baseline; justify-content:space-between; padding:14px 16px; }
  .lfc-eur-mm-card .lbl{ font-size:13px; }
  .lfc-eur-mm-card .val{ font-size:22px; margin-top:0; }
}
@media (max-width:479px){
  .lfc-eur-card-val{ font-size:28px; }
  .lfc-eur-sim-two{ grid-template-columns:1fr; }
}`;

  var HTML = `<!-- ======================= CARDS DE DESTAQUE ======================= -->
  <div class="lfc-eur-cards" id="lfc-eur-cards"></div>
  <p class="lfc-eur-refline">Atualizado automaticamente todos os dias úteis. Último valor disponível: <strong id="lfc-eur-refdate">-</strong> · a fonte gratuita (EMMI) tem 24h de desfasamento, por isso corresponde ao dia útil anterior.</p>
  <p class="lfc-eur-note">A variação face ao dia útil anterior está em pontos percentuais (p.p.). Uma subida da Euribor encarece a prestação; uma descida alivia-a. As taxas a 1 semana e 1 mês existem, mas não são usadas no crédito à habitação em Portugal, por isso ficam de fora.</p>

  <!-- ======================= GRAFICO ======================= -->
  <div class="lfc-eur-block">
    <div class="lfc-eur-block-head">
      <div>
        <span class="lfc-eur-eyebrow">Gráfico</span>
        <h2 class="lfc-eur-h2">Evolução das três Euribores</h2>
      </div>
      <div class="lfc-eur-ranges" id="lfc-eur-ranges">
        <button data-range="30d">Diário</button>
        <button data-range="1a" class="is-active">1 ano</button>
      </div>
    </div>
    <div class="lfc-eur-chartcard">
      <div class="lfc-eur-legend" id="lfc-eur-legend"></div>
      <div class="lfc-eur-canvas-wrap"><canvas id="lfc-eur-canvas"></canvas></div>
    </div>
    <p class="lfc-eur-note">Passa o rato sobre o gráfico para ver os valores em cada data. O "Diário" mostra os valores oficiais recentes (EMMI, com 24h de desfasamento); o "1 ano" mostra as médias mensais do Banco de Portugal.</p>
  </div>

  <!-- ======================= MEDIA MENSAL ======================= -->
  <div class="lfc-eur-block">
    <div class="lfc-eur-block-head">
      <div>
        <span class="lfc-eur-eyebrow">O que conta na revisão</span>
        <h2 class="lfc-eur-h2">Média mensal da Euribor</h2>
      </div>
    </div>
    <p class="lfc-eur-note" style="margin:0 0 20px">É a média mensal - e não o valor de um único dia - que o teu banco usa para rever a prestação. Regra geral aplica-se a média do mês anterior ao da revisão. Médias mensais fechadas: fonte Banco de Portugal.</p>
    <div id="lfc-eur-mm-current"></div>
    <div class="lfc-eur-table-wrap" style="margin-top:20px">
      <table class="lfc-eur-table">
        <thead>
          <tr>
            <th class="lfc-eur-th-left">Mês</th>
            <th>3 meses</th>
            <th>6 meses</th>
            <th class="lfc-eur-th-right">12 meses</th>
          </tr>
        </thead>
        <tbody id="lfc-eur-mm-tbody"></tbody>
      </table>
    </div>
  </div>

  <!-- ======================= TABELA ======================= -->
  <div class="lfc-eur-block">
    <div class="lfc-eur-block-head">
      <div>
        <span class="lfc-eur-eyebrow" id="lfc-eur-table-eyebrow">Últimos dias úteis</span>
        <h2 class="lfc-eur-h2">Evolução diária</h2>
      </div>
    </div>
    <div class="lfc-eur-table-wrap">
      <table class="lfc-eur-table">
        <thead>
          <tr>
            <th class="lfc-eur-th-left">Data</th>
            <th>3 meses</th>
            <th>6 meses</th>
            <th class="lfc-eur-th-right">12 meses</th>
          </tr>
        </thead>
        <tbody id="lfc-eur-tbody"></tbody>
      </table>
    </div>
    <a href="#" id="lfc-eur-more" class="lfc-eur-morebtn">Mostrar mais dias</a>
  </div>

  <!-- ======================= SIMULADOR ======================= -->
  <div class="lfc-eur-sim">
    <span class="lfc-eur-sim-eyebrow">Simulador</span>
    <h2 class="lfc-eur-sim-h2">Quanto pesa a Euribor na tua prestação?</h2>
    <p class="lfc-eur-sim-sub">Mete o capital que ainda deves, o prazo restante e o teu spread. Usamos a Euribor de hoje para o prazo que escolheres. É uma estimativa: o teu banco arredonda e pode ter outras condições.</p>
    <div class="lfc-eur-sim-grid">
      <div class="lfc-eur-sim-inputs">
        <div class="lfc-eur-sim-field">
          <label for="lfc-eur-cap">Capital em dívida (€)</label>
          <input id="lfc-eur-cap" type="text" inputmode="numeric" value="150.000">
        </div>
        <div class="lfc-eur-sim-two">
          <div class="lfc-eur-sim-field">
            <label for="lfc-eur-anos">Prazo restante (anos)</label>
            <input id="lfc-eur-anos" type="text" inputmode="numeric" value="30">
          </div>
          <div class="lfc-eur-sim-field">
            <label for="lfc-eur-spread">Spread (%)</label>
            <input id="lfc-eur-spread" type="text" inputmode="decimal" value="1,00">
          </div>
        </div>
        <div class="lfc-eur-sim-field">
          <label>Indexante (prazo da Euribor)</label>
          <div class="lfc-eur-sim-pills" id="lfc-eur-pills">
            <button data-prazo="m3">3 meses</button>
            <button data-prazo="m6">6 meses</button>
            <button data-prazo="m12" class="is-active">12 meses</button>
          </div>
        </div>
      </div>
      <div class="lfc-eur-sim-result">
        <div class="lfc-eur-sim-row"><span>Euribor <span id="lfc-eur-sim-prazolabel">12 meses</span></span><span id="lfc-eur-sim-eurib">-</span></div>
        <div class="lfc-eur-sim-row"><span>+ Spread</span><span id="lfc-eur-sim-spread">-</span></div>
        <div class="lfc-eur-sim-row lfc-eur-sim-row--tan"><span>= TAN</span><span id="lfc-eur-sim-tan">-</span></div>
        <div class="lfc-eur-sim-prest">
          <span class="lfc-eur-sim-prest-label">Prestação mensal estimada</span>
          <span class="lfc-eur-sim-prest-val" id="lfc-eur-sim-prest">-</span>
        </div>
        <div class="lfc-eur-sim-shock">Se a Euribor subir <strong>+0,5 p.p.</strong>, a tua prestação sobe cerca de <strong id="lfc-eur-sim-shock">-</strong> por mês.</div>
      </div>
    </div>
    <p class="lfc-eur-sim-foot">Simulação indicativa (método de prestação constante / sistema francês). Não inclui seguros, comissões nem arredondamentos do banco e não constitui aconselhamento. Confirma o impacto real com as calculadoras de crédito: <a href="/calculadora-taxa-de-esforco" class="lfc-eur-sim-link">Taxa de esforço</a> e as restantes ferramentas de crédito habitação da LF.</p>
  </div>`;

  function run(DATA){
    var LFC_EUR_DIARIO = { dataReferencia: DATA.dataReferencia, serie: DATA.serie };
    var LFC_EUR_HISTORICO = DATA.historico || [];
    var PRAZOS = [
    { key:'m3',  label:'3 meses',  color:'#2E90FA' },
    { key:'m6',  label:'6 meses',  color:'#F79009' },
    { key:'m12', label:'12 meses', color:'#9B8AFB' }
  ];
  var MESES = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];

  /* ---------------- Helpers pt-PT ---------------- */
  function fmtPct(v){ if(v==null||!isFinite(v)) return '-'; return v.toFixed(3).replace('.',',')+'%'; }
  function fmtPP(delta){
    if(delta==null||!isFinite(delta)) return '';
    var s = (delta>0?'+':delta<0?'-':'') + Math.abs(delta).toFixed(3).replace('.',',');
    return s+' p.p.';
  }
  function fmtEUR(v){
    if(!isFinite(v)) return '-';
    var parts = Math.abs(v).toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,'.');
    return (v<0?'- ':'')+parts[0]+','+parts[1]+'\u20AC';
  }
  function parseNum(str){
    if(str==null) return 0;
    return parseFloat(String(str).replace(/\s/g,'').replace(/\./g,'').replace(',','.'))||0;
  }
  function parseDMY(s){ var p=s.split('/'); return new Date(+p[2], +p[1]-1, +p[0]); }
  function shortDate(s){ var p=s.split('/'); return p[0]+'/'+p[1]; }

  var serie = LFC_EUR_DIARIO.serie.slice();
  var last = serie[serie.length-1];
  var prev = serie[serie.length-2] || last;

  /* "ha um mes": linha mais proxima de (data mais recente - 30 dias) */
  function rowAroundMonthAgo(){
    var target = parseDMY(last.d).getTime() - 30*864e5;
    var pool = serie.slice();
    for(var j=0;j<LFC_EUR_HISTORICO.length;j++){
      var hp = LFC_EUR_HISTORICO[j]; var pm = hp.d.split('-');
      pool.push({ d:'01/'+pm[1]+'/'+pm[0], m3:hp.m3, m6:hp.m6, m12:hp.m12 });
    }
    var best = pool[0], bestDiff = Infinity;
    for(var i=0;i<pool.length;i++){
      var diff = Math.abs(parseDMY(pool[i].d).getTime()-target);
      if(diff<bestDiff){ bestDiff=diff; best=pool[i]; }
    }
    return best;
  }
  var monthAgo = rowAroundMonthAgo();

  /* ---------------- Hero ---------------- */
  var refEl = document.getElementById('lfc-eur-refdate');
  if(refEl) refEl.textContent = LFC_EUR_DIARIO.dataReferencia;

  /* ---------------- Cards ---------------- */
  function deltaChip(delta){
    var up = delta>0.0004, down = delta<-0.0004;
    var color = up?'#F04438':down?'#17B26A':'#98A2B3';
    var bg    = up?'#FEF3F2':down?'#ECFDF3':'#F2F4F7';
    var arrow = up?'&#9650;':down?'&#9660;':'&#8226;';
    return '<span class="lfc-eur-card-delta" style="color:'+color+';background:'+bg+';">'+arrow+' '+fmtPP(delta)+'</span>';
  }
  function mDelta(delta){
    var up = delta>0.0004, down = delta<-0.0004;
    var color = up?'#F04438':down?'#17B26A':'#98A2B3';
    return '<span class="lfc-eur-card-mdelta" style="color:'+color+';">'+fmtPP(delta)+'</span>';
  }
  (function renderCards(){
    var wrap = document.getElementById('lfc-eur-cards'); if(!wrap) return;
    var html='';
    PRAZOS.forEach(function(p){
      var today=last[p.key], yst=prev[p.key], mth=monthAgo[p.key];
      html+= '<div class="lfc-eur-card">'
        + '<div class="lfc-eur-card-top"><span class="lfc-eur-card-label">Euribor '+p.label+'</span>'
        + '<span class="lfc-eur-card-bar" style="background:'+p.color+';"></span></div>'
        + '<div class="lfc-eur-card-valrow"><span class="lfc-eur-card-val">'+fmtPct(today)+'</span>'
        + deltaChip(today-yst)+'</div>'
        + '<div class="lfc-eur-card-foot">'
        + '<div class="lfc-eur-card-line"><span class="k">Dia útil anterior</span><span class="v">'+fmtPct(yst)+'</span></div>'
        + '</div></div>';
    });
    wrap.innerHTML=html;
  })();

  /* ---------------- Tabela (mais recente no topo) ---------------- */
  var INITIAL_ROWS = 10;
  (function renderTable(){
    var tb=document.getElementById('lfc-eur-tbody'); if(!tb) return;
    var rows = serie.slice().reverse().slice(0,30);
    var eb=document.getElementById('lfc-eur-table-eyebrow'); if(eb) eb.textContent='Últimos '+rows.length+' dias úteis';
    var html='';
    rows.forEach(function(r,i){
      var extra = i>=INITIAL_ROWS ? ' data-extra="1"' : '';
      var today = i===0 ? ' is-today' : '';
      html+='<tr class="'+today.trim()+'"'+extra+'>'
        + '<td class="lfc-eur-td-date">'+r.d+'</td>'
        + '<td>'+fmtPct(r.m3)+'</td>'
        + '<td>'+fmtPct(r.m6)+'</td>'
        + '<td class="lfc-eur-td-last">'+fmtPct(r.m12)+'</td></tr>';
    });
    tb.innerHTML=html;
    var moreBtn=document.getElementById('lfc-eur-more');
    var extras=tb.querySelectorAll('tr[data-extra]');
    if(extras.length===0 && moreBtn){ moreBtn.style.display='none'; }
    if(moreBtn){
      moreBtn.addEventListener('click',function(e){
        e.preventDefault();
        var shown=tb.querySelector('tr[data-extra].is-shown');
        if(shown){ extras.forEach(function(t){t.classList.remove('is-shown');}); moreBtn.textContent='Mostrar mais dias'; }
        else { extras.forEach(function(t){t.classList.add('is-shown');}); moreBtn.textContent='Mostrar menos'; }
      });
    }
  })();

  /* ---------------- Grafico (Chart.js) ---------------- */
  function loadChartJS(cb){
    if(window.Chart){ cb(); return; }
    var s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/chart.js';
    s.onload=cb; document.head.appendChild(s);
  }
  var chart=null, hidden={m3:false,m6:false,m12:false}, currentRange='1a';

  function dataForRange(range){
    if(range==='30d'){
      var rows=serie.slice(-30);
      return { labels: rows.map(function(r){return shortDate(r.d);}), rows:rows, mode:'d' };
    }
    var months = range==='1a' ? 12 : 60;
    var rows = LFC_EUR_HISTORICO.slice(-months);
    return { labels: rows.map(function(r){ var p=r.d.split('-'); return p[1]+'/'+p[0].slice(2); }), rows:rows, mode:'m' };
  }
  function buildLegend(){
    var el=document.getElementById('lfc-eur-legend'); if(!el) return;
    el.innerHTML = PRAZOS.map(function(p){
      return '<span class="lg'+(hidden[p.key]?' is-off':'')+'" data-key="'+p.key+'"><span class="dot" style="background:'+p.color+';"></span>'+p.label+'</span>';
    }).join('');
    el.querySelectorAll('.lg').forEach(function(lg){
      lg.addEventListener('click',function(){
        var k=lg.getAttribute('data-key'); hidden[k]=!hidden[k];
        lg.classList.toggle('is-off',hidden[k]); drawChart();
      });
    });
  }
  function drawChart(){
    var d=dataForRange(currentRange);
    var accent=(getComputedStyle(document.documentElement).getPropertyValue('--colors--accent-blue')||'').trim()||'#2E90FA';
    PRAZOS[0].color=accent;
    var datasets=PRAZOS.filter(function(p){return !hidden[p.key];}).map(function(p){
      return { label:p.label, data:d.rows.map(function(r){return r[p.key];}), borderColor:p.color,
        backgroundColor:p.color, borderWidth:2, pointRadius:0, pointHoverRadius:4, tension:0.25, fill:false };
    });
    var cfg={ type:'line', data:{ labels:d.labels, datasets:datasets },
      options:{ responsive:true, maintainAspectRatio:false, animation:false,
        interaction:{ mode:'index', intersect:false },
        plugins:{ legend:{display:false},
          tooltip:{ backgroundColor:'#121721', borderRadius:8, padding:10, usePointStyle:true,
            titleColor:'#fff', bodyColor:'#E9ECF1',
            callbacks:{ label:function(c){ return ' '+c.dataset.label+': '+fmtPct(c.parsed.y); } } } },
        scales:{
          x:{ grid:{display:false}, ticks:{ color:'#4F5969', font:{family:'Inter',size:11}, maxRotation:0, autoSkip:true, maxTicksLimit: d.mode==='d'?8:9 } },
          y:{ grid:{color:'#E9ECF1'}, ticks:{ color:'#4F5969', font:{family:'Inter',size:11}, callback:function(v){return v.toFixed(2).replace('.',',')+'%';} } }
        }
      } };
    if(chart){ chart.data=cfg.data; chart.options=cfg.options; chart.update(); }
    else { chart=new Chart(document.getElementById('lfc-eur-canvas').getContext('2d'), cfg); }
  }
  (function initChart(){
    var ranges=document.getElementById('lfc-eur-ranges');
    loadChartJS(function(){ buildLegend(); drawChart(); });
    if(ranges){
      ranges.addEventListener('click',function(e){
        var b=e.target.closest('button'); if(!b) return;
        currentRange=b.getAttribute('data-range');
        ranges.querySelectorAll('button').forEach(function(x){x.classList.remove('is-active');});
        b.classList.add('is-active');
        if(window.Chart) drawChart();
      });
    }
  })();

  /* ---------------- Simulador ---------------- */
  var simPrazo='m12';
  function simEuribor(){ return last[simPrazo]; }
  function prazoLabel(){ var p=PRAZOS.filter(function(x){return x.key===simPrazo;})[0]; return p?p.label:''; }
  function prestacao(capital, anos, tanPct){
    var i=tanPct/100/12, n=Math.round(anos*12);
    if(n<=0) return 0;
    if(i<=0) return capital/n;
    return capital*i/(1-Math.pow(1+i,-n));
  }
  function runSim(){
    var cap=parseNum(document.getElementById('lfc-eur-cap').value);
    var anos=parseNum(document.getElementById('lfc-eur-anos').value);
    var spread=parseNum(document.getElementById('lfc-eur-spread').value);
    var eurib=simEuribor();
    var tan=eurib+spread;
    var p0=prestacao(cap,anos,tan);
    var p1=prestacao(cap,anos,tan+0.5);
    document.getElementById('lfc-eur-sim-prazolabel').textContent=prazoLabel();
    document.getElementById('lfc-eur-sim-eurib').textContent=fmtPct(eurib);
    document.getElementById('lfc-eur-sim-spread').textContent=(spread>0?'+ ':'')+fmtPct(spread);
    document.getElementById('lfc-eur-sim-tan').textContent=fmtPct(tan);
    document.getElementById('lfc-eur-sim-prest').textContent=fmtEUR(p0);
    document.getElementById('lfc-eur-sim-shock').textContent=fmtEUR(p1-p0);
  }
  ['lfc-eur-cap','lfc-eur-anos','lfc-eur-spread'].forEach(function(id){
    var el=document.getElementById(id); if(el) el.addEventListener('input',runSim);
  });
  var pills=document.getElementById('lfc-eur-pills');
  if(pills){
    pills.addEventListener('click',function(e){
      var b=e.target.closest('button'); if(!b) return;
      simPrazo=b.getAttribute('data-prazo');
      pills.querySelectorAll('button').forEach(function(x){x.classList.remove('is-active');});
      b.classList.add('is-active'); runSim();
    });
  }
  runSim();

  /* ---------------- Media mensal ---------------- */
  (function renderMediaMensal(){
    var ymLast = last.d.split('/')[2]+'-'+last.d.split('/')[1];
    var monthDays = serie.filter(function(r){ var p=r.d.split('/'); return (p[2]+'-'+p[1])===ymLast; });
    function avg(key){ if(!monthDays.length) return null; var s=0; monthDays.forEach(function(r){ s+=r[key]; }); return s/monthDays.length; }
    var mesNome = MESES[parseInt(last.d.split('/')[1],10)-1];
    var cur = document.getElementById('lfc-eur-mm-current');
    if(cur){
      var mmCap = 'Média de '+mesNome+' até à data ('+monthDays.length+' dia'+(monthDays.length!==1?'s':'')+', ainda a fechar)';
      var mmCards = PRAZOS.map(function(p){
        return '<div class="lfc-eur-mm-card"><span class="lbl">'+p.label+'</span><div class="val">'+fmtPct(avg(p.key))+'</div></div>';
      }).join('');
      cur.innerHTML = '<div class="lfc-eur-mm-cards">'+mmCards+'</div><p class="lfc-eur-mm-cap">'+mmCap+'</p>';
    }
    var tb=document.getElementById('lfc-eur-mm-tbody');
    if(tb){
      var rows = LFC_EUR_HISTORICO.slice().reverse().slice(0,12);
      tb.innerHTML = rows.map(function(hh){
        var p=hh.d.split('-'); var nome=MESES[parseInt(p[1],10)-1]+' de '+p[0];
        return '<tr><td class="lfc-eur-td-date">'+nome+'</td><td>'+fmtPct(hh.m3)+'</td><td>'+fmtPct(hh.m6)+'</td><td class="lfc-eur-td-last">'+fmtPct(hh.m12)+'</td></tr>';
      }).join('');
    }
  })();
  }

  function boot(DATA){
    if(!document.getElementById("lfc-eur-style")){
      var st=document.createElement("style"); st.id="lfc-eur-style"; st.textContent=CSS;
      (document.head||document.documentElement).appendChild(st);
    }
    var root=document.getElementById("lfc-eur"); if(!root){ return; }
    root.innerHTML=HTML;
    run(DATA);
  }

  function start(){
    fetch(DATA_URL, {cache:"no-store"})
      .then(function(r){ if(!r.ok) throw new Error("HTTP "+r.status); return r.json(); })
      .then(boot)
      .catch(function(err){
        console.error("[euribor] erro a carregar dados", err);
        var root=document.getElementById("lfc-eur");
        if(root){ root.innerHTML='<p style="font:14px/1.5 inherit;color:#98A2B3;margin:0;">Nao foi possivel carregar os dados da Euribor. Tenta novamente daqui a pouco.</p>'; }
      });
  }

  if(document.readyState==="loading"){ document.addEventListener("DOMContentLoaded", start); } else { start(); }
})();
