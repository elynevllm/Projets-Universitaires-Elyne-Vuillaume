import { PROJECTS } from "./data.js";

function qs(sel, root=document){ return root.querySelector(sel); }

function categoryLabel(key){
  switch(key){
    case "devweb": return "Développement web";
    case "communication": return "Communication";
    case "creation": return "Création / Design";
    default: return key;
  }
}

function escapeHtml(str=""){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function getProjectId(){
  const url = new URL(window.location.href);
  return url.searchParams.get("id");
}

function setBackLink(project){
  const url = new URL("index.html", window.location.href);
  // Keep category when going back
  url.searchParams.set("cat", project.category);
  qs("#backLink").setAttribute("href", url.pathname + url.search);
}

function renderNotFound(){
  qs("#title").textContent = "Projet introuvable";
  qs("#subtitle").textContent = "Le lien semble incorrect.";
  qs("#year").textContent = "";
  qs("#category").textContent = "";
  qs("#heroImg").innerHTML = "";
  qs("#desc").textContent = "Retourne à la liste et réessaie.";
  qs("#context").textContent = "";
  qs("#ac").innerHTML = "";
  qs("#backLink").setAttribute("href","index.html");
}

function render(project){
  document.title = `Elyne Vuillaume — ${project.title}`;
  qs("#title").textContent = project.title;
  qs("#subtitle").textContent = project.subtitle || "";
  qs("#year").textContent = project.year;
  qs("#category").textContent = categoryLabel(project.category);

  // hero image
  qs("#heroImg").innerHTML = `
    <img src="${project.hero}" alt="" onerror="this.remove(); this.parentElement.innerHTML='<div style=&quot;display:flex;align-items:center;justify-content:center;height:100%;min-height:320px;color:rgba(239,230,214,.9);letter-spacing:.12em;text-transform:uppercase;font-size:12px;&quot;>Ajoute une image héros ici</div>';">
  `;

  qs("#desc").textContent = project.description || "";
  qs("#context").textContent = project.context || "";

  const acWrap = qs("#ac");
  acWrap.innerHTML = (project.ac || []).map(x => `<span class="ac-chip">${escapeHtml(x)}</span>`).join("");

  setBackLink(project);
}

function init(){
  const id = getProjectId();
  const project = PROJECTS.find(p => p.id === id);
  if (!project) return renderNotFound();
  render(project);
}

init();
