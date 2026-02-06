async function loadMedia(type) {
  const url = `media/${type}/`;

  const response = await fetch(`https://api.github.com/repos/zinoxplus/iran-media/contents/media/${type}`);
  const files = await response.json();

  let html = `<h2>${type.toUpperCase()}</h2>`;

  files.forEach(file => {

    if (file.name.endsWith(".mp3")) {
      html += `
        <p>${file.name}</p>
        <audio controls src="${file.download_url}"></audio>
      `;
    }

    if (file.name.endsWith(".mp4")) {
      html += `
        <p>${file.name}</p>
        <video controls width="400" src="${file.download_url}"></video>
      `;
    }

    if (file.name.endsWith(".jpg") || file.name.endsWith(".png")) {
      html += `
        <p>${file.name}</p>
        <img width="300" src="${file.download_url}">
      `;
    }

    if (file.name.endsWith(".txt")) {
      html += `
        <p><a href="${file.download_url}" target="_blank">${file.name}</a></p>
      `;
    }

  });

  document.getElementById("content").innerHTML = html;
}

function showSection(section) {
  loadMedia(section);
}
