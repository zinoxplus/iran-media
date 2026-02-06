let allFiles = []; // برای جستجو

async function loadMedia(type = null) {
  const types = type ? [type] : ["music","videos","images","texts"];
  let html = "";
  allFiles = [];

  for (const t of types) {
    const apiUrl = `https://api.github.com/repos/zinoxplus/iran-media/contents/media/${t}`;
    try {
      const response = await fetch(apiUrl);
      const files = await response.json();

      for (const file of files) {
        let itemHTML = "";

        // موزیک
        if (file.name.endsWith(".mp3")) {
          itemHTML = `
            <div class="media-item" data-name="${file.name}">
              <p>🎵 ${file.name}</p>
              <audio controls src="${file.download_url}"></audio>
            </div>`;
        }

        // ویدیو
        else if (file.name.endsWith(".mp4")) {
          itemHTML = `
            <div class="media-item" data-name="${file.name}">
              <p>🎬 ${file.name}</p>
              <video controls src="${file.download_url}"></video>
            </div>`;
        }

        // عکس
        else if (file.name.endsWith(".jpg") || file.name.endsWith(".png")) {
          itemHTML = `
            <div class="media-item" data-name="${file.name}">
              <p>🖼 ${file.name}</p>
              <img src="${file.download_url}">
            </div>`;
        }

        // متن txt
        else if (file.name.endsWith(".txt")) {
          const txtContent = await fetch(file.download_url).then(res => res.text());
          itemHTML = `
            <div class="media-item" data-name="${file.name}">
              <h3>📜 ${file.name}</h3>
              <p>${txtContent}</p>
            </div>`;
        }

        html += itemHTML;
        allFiles.push({name: file.name.toLowerCase(), html: itemHTML});
      }

    } catch (error) {
      console.error("خطا در بارگذاری فایل‌ها:", error);
    }
  }

  document.getElementById("content").innerHTML = html || "<p>هیچ فایلی یافت نشد.</p>";
}

// نمایش بخش خاص
function showSection(section) {
  loadMedia(section);
}

// جستجوی زنده
function searchFiles() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filtered = allFiles.filter(f => f.name.includes(query));
  document.getElementById("content").innerHTML = filtered.map(f => f.html).join("") || "<p>موردی یافت نشد.</p>";
}

// بارگذاری اولیه
document.addEventListener("DOMContentLoaded", () => loadMedia());
