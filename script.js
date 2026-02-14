let allFiles = [];

const repo = "https://api.github.com/repos/zinoxplus/iran-media/contents/media";

async function fetchCategory(type) {
  const res = await fetch(`${repo}/${type}`);
  return await res.json();
}

/* خانه = آخرین آپلودها */
async function loadHome() {
  document.getElementById("pageTitle").innerText = "آخرین آپلودها";
  allFiles = [];

  let types = ["music", "videos", "images", "texts"];
  let combined = [];

  for (let t of types) {
    let files = await fetchCategory(t);
    files.forEach(f => combined.push({...f, category: t}));
  }

  combined = combined.slice(0, 12); // فقط ۱۲ تای آخر

  renderCards(combined);
}

/* دسته‌بندی */
async function loadCategory(type) {
  document.getElementById("pageTitle").innerText = "بخش: " + type;
  let files = await fetchCategory(type);

  files = files.map(f => ({...f, category: type}));

  renderCards(files);
}

/* نمایش کارت‌ها */
function renderCards(files) {
  allFiles = files;

  let html = files.map(file => `
    <div class="card" onclick="openFile('${file.download_url}', '${file.name}', '${file.category}')">
      <h3>${file.name}</h3>
      <p>📂 ${file.category}</p>
      <small>برای باز کردن کلیک کن</small>
    </div>
  `).join("");

  document.getElementById("cards").innerHTML = html;
}

/* Lazy Load Viewer */
async function openFile(url, name, category) {
  let content = "";

  if (category === "music") {
    content = `<h2>${name}</h2><audio controls src="${url}"></audio>`;
  }

  if (category === "videos") {
    content = `<h2>${name}</h2><video controls width="100%" src="${url}"></video>`;
  }

  if (category === "images") {
    content = `<h2>${name}</h2><img width="100%" src="${url}">`;
  }

  if (category === "texts") {
    let txt = await fetch(url).then(r => r.text());
    content = `<h2>${name}</h2><pre>${txt}</pre>`;
  }

  document.getElementById("modalContent").innerHTML = content;
  document.getElementById("modal").style.display = "block";
}

/* بستن مودال */
function closeModal() {
  document.getElementById("modal").style.display = "none";
}

/* Search Pro */
function searchFiles() {
  let q = document.getElementById("searchInput").value.toLowerCase();

  let filtered = allFiles.filter(f =>
    f.name.toLowerCase().includes(q)
  );

  renderCards(filtered);
}

/* شروع سایت */
document.addEventListener("DOMContentLoaded", loadHome);
