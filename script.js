async function loadMedia(type) {
    const apiUrl = `https://api.github.com/repos/zinoxplus/iran-media/contents/media/${type}`;
    
    try {
        const response = await fetch(apiUrl);
        const files = await response.json();

        let html = `<h2>${type.toUpperCase()}</h2>`;

        for (const file of files) {

            // آهنگ
            if (file.name.endsWith(".mp3")) {
                html += `
                    <div class="media-item">
                        <p>🎵 ${file.name}</p>
                        <audio controls src="${file.download_url}"></audio>
                    </div>
                `;
            }

            // ویدیو
            else if (file.name.endsWith(".mp4")) {
                html += `
                    <div class="media-item">
                        <p>🎬 ${file.name}</p>
                        <video controls width="400" src="${file.download_url}"></video>
                    </div>
                `;
            }

            // عکس
            else if (file.name.endsWith(".jpg") || file.name.endsWith(".png")) {
                html += `
                    <div class="media-item">
                        <p>🖼 ${file.name}</p>
                        <img width="300" src="${file.download_url}">
                    </div>
                `;
            }

            // متن txt
            else if (file.name.endsWith(".txt")) {
                // خواندن محتوا
                const txtContent = await fetch(file.download_url).then(res => res.text());
                html += `
                    <div class="media-item" style="
                        border:1px solid gold;
                        margin:15px;
                        padding:15px;
                        background:#1e1a12;
                        border-radius:10px;
                        text-align:right;
                        white-space:pre-wrap;
                    ">
                        <h3>📜 ${file.name}</h3>
                        <p>${txtContent}</p>
                    </div>
                `;
            }
        }

        document.getElementById("content").innerHTML = html;

    } catch (error) {
        console.error("خطا در بارگذاری فایل‌ها:", error);
        document.getElementById("content").innerHTML = "<p>بارگذاری فایل‌ها موفقیت‌آمیز نبود.</p>";
    }
}

// نمایش بخش مورد نظر
function showSection(section) {
    loadMedia(section);
}

// بارگذاری اولیه
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("content").innerHTML = "<p>لطفا یک دسته را انتخاب کنید.</p>";
});
