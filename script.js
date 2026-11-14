// ===== Missões: edite aqui para criar as suas =====
const QUESTS = [
  {id:"html", title:"Mestre do HTML", desc:"Estrutura de páginas web.", questions:[
    {q:"Qual tag cria o maior título?", o:["<h6>","<h1>","<head>","<title>"], a:1},
    {q:"Qual atributo define o destino de um link?", o:["src","href","alt","link"], a:1},
    {q:"Qual tag cria uma lista ordenada?", o:["<ul>","<li>","<ol>","<dl>"], a:2}]},
  {id:"css", title:"Feiticeiro do CSS", desc:"Estilos, cores e layouts.", questions:[
    {q:"Qual propriedade muda a cor do texto?", o:["font-color","text-style","color","fill"], a:2},
    {q:"Qual valor ativa o layout flexível?", o:["display:flex","position:flex","float:flex","flex:none"], a:0},
    {q:"Qual seletor escolhe um elemento com class=\"card\"?", o:["#card",".card","card()","*card"], a:1}]},
  {id:"git", title:"Explorador do Git", desc:"Versionamento de código.", questions:[
    {q:"Qual comando salva alterações no histórico?", o:["git push","git commit","git clone","git pull"], a:1},
    {q:"Qual comando baixa um repositório?", o:["git clone","git init","git add","git merge"], a:0},
    {q:"O que o GitHub Pages faz?", o:["Compila apps mobile","Hospeda sites estáticos","Cria bancos de dados","Envia e-mails"], a:1}]},
  {id:"js", title:"Caçador de JavaScript", desc:"Lógica no navegador.", questions:[
    {q:"Qual palavra declara uma constante?", o:["var","let","const","def"], a:2},
    {q:"Qual método seleciona um elemento por id?", o:["getElementById","queryAll","findId","selectId"], a:0},
    {q:"Qual é o resultado de 2 + \"2\"?", o:["4","\"22\"","NaN","erro"], a:1}]}
];
const PTS_CORRECT = 10, PTS_BONUS = 20;
const LEVELS = [[0,"Aprendiz"],[40,"Explorador"],[90,"Aventureiro"],[140,"Herói"],[200,"Lenda"]];
// ==================================================

const $ = s => document.querySelector(s), app = $("#app");
let save = JSON.parse(localStorage.getItem("quest-quiz") || "{}"); // {id: melhorAcerto}
const persist = () => localStorage.setItem("quest-quiz", JSON.stringify(save));
const pointsOf = q => { const n = save[q.id]; return n == null ? 0 : n*PTS_CORRECT + (n === q.questions.length ? PTS_BONUS : 0); };
const total = () => QUESTS.reduce((s,q) => s + pointsOf(q), 0);

function header(){
  const p = total();
  let i = LEVELS.filter(l => p >= l[0]).length - 1, cur = LEVELS[i], nx = LEVELS[i+1];
  $("#points").textContent = p; $("#rank").textContent = cur[1];
  $("#bar").style.width = (nx ? (p-cur[0])/(nx[0]-cur[0])*100 : 100) + "%";
  $("#next").textContent = nx ? `Faltam ${nx[0]-p} pts para ${nx[1]}` : "Nível máximo!";
}

function home(){
  header();
  app.innerHTML = `<div class="grid">${QUESTS.map(q => {
    const done = save[q.id] != null, max = q.questions.length*PTS_CORRECT + PTS_BONUS;
    return `<button class="quest ${done?"done":""}" data-id="${q.id}">
      <h2>${q.title}</h2><p>${q.desc}</p>
      <span class="tag">${done ? `Concluída · ${pointsOf(q)}/${max} pts` : `Valendo até ${max} pts`}</span></button>`;
  }).join("")}</div>`;
  app.querySelectorAll(".quest").forEach(b => b.onclick = () => play(QUESTS.find(q => q.id === b.dataset.id)));
}

function play(quest){
  let i = 0, hits = 0;
  const show = () => {
    const x = quest.questions[i];
    app.innerHTML = `<section class="panel">
      <div class="meta"><span>${quest.title}</span><span>Pergunta ${i+1} de ${quest.questions.length}</span></div>
      <h2>${x.q}</h2>
      <div class="opts">${x.o.map((t,k) => `<button class="opt" data-k="${k}">${t.replace(/</g,"&lt;")}</button>`).join("")}</div>
      <p id="fb" aria-live="polite"></p><div id="act"></div></section>`;
    app.querySelectorAll(".opt").forEach(b => b.onclick = () => answer(+b.dataset.k));
  };
  const answer = k => {
    const x = quest.questions[i], opts = app.querySelectorAll(".opt");
    opts.forEach(b => b.disabled = true);
    opts[x.a].classList.add("right");
    if (k === x.a) hits++; else opts[k].classList.add("wrong");
    $("#fb").textContent = k === x.a ? `Correto! +${PTS_CORRECT} pts` : "Não foi dessa vez.";
    const last = i === quest.questions.length - 1;
    $("#act").innerHTML = `<button class="btn" id="go">${last ? "Ver resultado" : "Próxima pergunta"}</button>`;
    $("#go").focus();
    $("#go").onclick = () => last ? finish() : (i++, show());
  };
  const finish = () => {
    const before = pointsOf(quest), n = quest.questions.length;
    if (save[quest.id] == null || hits > save[quest.id]) save[quest.id] = hits;
    persist();
    const gain = pointsOf(quest) - before;
    header();
    app.innerHTML = `<section class="panel"><h2>${hits === n ? "Missão perfeita!" : "Missão concluída"}</h2>
      <p>Você acertou ${hits} de ${n}. ${gain > 0 ? `Você ganhou ${gain} pts${hits===n?`, incluindo ${PTS_BONUS} de bônus`:""}.` : "Sua melhor pontuação continua a mesma."}</p>
      <button class="btn" id="again">Jogar de novo</button><button class="btn ghost" id="back">Voltar às missões</button></section>`;
    $("#again").onclick = () => play(quest); $("#back").onclick = home;
  };
  show();
}

$("#reset").onclick = () => { if (confirm("Apagar todo o progresso?")) { save = {}; persist(); home(); } };
home();
