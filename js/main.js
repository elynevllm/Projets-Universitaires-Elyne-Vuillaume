import { PROJECTS } from "./data.js";

const CATEGORIES = [
  { key: "all", label: "Tout" },
  { key: "devweb", label: "Développement web" },
  { key: "communication", label: "Communication" },
  { key: "creation", label: "Création / Design" }
];

function qs(sel, root=document){ return root.querySelector(sel); }
function qsa(sel, root=document){ return [...root.querySelectorAll(sel)]; }

function categoryLabel(key){
  const c = CATEGORIES.find(x => x.key === key);
  return c ? c.label : key;
}

function buildCategoryButtons(){
  const wrap = qs("#filters");
  wrap.innerHTML = "";
  CATEGORIES.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "btn btn--ghost";
    btn.type = "button";
    btn.dataset.cat = cat.key;
    btn.textContent = cat.label;
    btn.addEventListener("click", () => setCategory(cat.key));
    wrap.appendChild(btn);
  });
}

let currentCategory = "all";

function setCategory(cat){
  currentCategory = cat;

  qsa("#filters .btn").forEach(b => {
    b.classList.toggle("btn--active", b.dataset.cat === cat);
    b.classList.toggle("btn--ghost", b.dataset.cat !== cat);
  });

  renderProjects();
  const label = categoryLabel(cat);
  qs("#currentCat").textContent = (cat === "all") ? "Tous les projets" : label;
}

function cardImgHTML(src){
  // If the file doesn't exist yet, show a placeholder. The browser will fire onerror.
  return `
    <div class="pcard__img">
      <img src="${src}" alt="" loading="lazy" onerror="this.remove(); this.parentElement.textContent='Ajoute une image ici';">
    </div>
  `;
}

function renderProjects(){
  const list = qs("#projectCards");
  const items = PROJECTS
    .filter(p => currentCategory === "all" ? true : p.category === currentCategory);

  list.innerHTML = items.map(p => `
    <a class="pcard" href="project.html?id=${encodeURIComponent(p.id)}" aria-label="Ouvrir le projet : ${escapeHtml(p.title)}">
      ${cardImgHTML(p.thumb)}
      <div class="pcard__body">
        <div class="pcard__meta">
          <span class="pill">${escapeHtml(p.year)}</span>
          <span class="pill">${escapeHtml(categoryLabel(p.category))}</span>
        </div>
        <h3 class="pcard__title">${escapeHtml(p.title)}</h3>
        <p class="pcard__desc">${escapeHtml(p.subtitle || p.description)}</p>
      </div>
    </a>
  `).join("");

  qs("#count").textContent = String(items.length);
}

function escapeHtml(str=""){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function init(){
  buildCategoryButtons();
  setCategory("all");

  // optional: preselect category via URL ?cat=devweb
  const url = new URL(window.location.href);
  const cat = url.searchParams.get("cat");
  if (cat && CATEGORIES.some(c => c.key === cat)) setCategory(cat);
}

init();
