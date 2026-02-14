let allFiles = [];

const repoUrl = "https://api.github.com/repos/zinoxplus/iran-media/contents/media";

/* Load Home with sorted by date */
async function loadHome() {
  document.getElementById("pageTitle").innerText = "آخرین شاهکارها";
  allFiles = [];

  let types = ["music","videos","images","texts"];
  let combined = [];

  for (let t of types) {
    let files = await fetch(`${repoUrl}/${t}`).then(r=>r.json());
    files.forEach(f => combined.push({...f, category:t}));
  }

  combined.sort((a,b) => new Date(b.sha) - new Date(a.sha)); // sort by github updated SHA
  renderCards(combined);
}

async function loadCategory(type) {
  document.getElementById("pageTitle").innerText = "دسته: " + type;
  let files = await fetch(`${repoUrl}/${type}`).then(r=>r.json());
  files = files.map(f => ({...f, category:type}));
  renderCards(files);
}

function renderCards(files) {
  allFiles = files;
  document.getElementById("cards").innerHTML = files.map(f => `
    <div class="card" onclick="openFile('${f.download_url}','${f.name}','${f.category}')">
      <h3>${f.name}</h3><p>📂 ${f.category}</p>
    </div>
  `).join("");
}

async function openFile(url,name,cat) {
  let html = "";
  if(cat==="music") html=`<h2>${name}</h2><audio controls src="${url}"></audio>`;
  if(cat==="videos") html=`<h2>${name}</h2><video controls width="100%" src="${url}"></video>`;
  if(cat==="images") html=`<h2>${name}</h2><img width="100%" src="${url}">`;
  if(cat==="texts") html=`<h2>${name}</h2><pre>${await fetch(url).then(r=>r.text())}</pre>`;
  document.getElementById("modalContent").innerHTML = html;
  document.getElementById("modal").style.display="block";
}

function closeModal() {
  document.getElementById("modal").style.display="none";
}

function searchFiles() {
  let q=document.getElementById("searchInput").value.toLowerCase();
  renderCards(allFiles.filter(f=>f.name.toLowerCase().includes(q)));
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}

document.addEventListener("DOMContentLoaded", loadHome);
