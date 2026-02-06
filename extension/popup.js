const browserAPI = typeof browser !== "undefined" ? browser : chrome;
const currentlyPlayingDiv = document.querySelector(".currently-playing");
const manifest = browserAPI.runtime.getManifest();
const version = manifest.version;

document.querySelector(".version").innerText = `v${version}`;

// ─────────────────────────────────────────────
// Storage (Chrome + Firefox compatible)
// ─────────────────────────────────────────────
let storageArea;

if (chrome?.storage?.session) {
  storageArea = chrome.storage.session; // Chrome MV3
} else {
  storageArea = chrome.storage.local; // Firefox
}

const storageGet = (key) => new Promise((resolve) => storageArea.get(key, resolve));

const storageSet = (obj) => new Promise((resolve) => storageArea.set(obj, resolve));

console.log("Popup opened");

// ─────────────────────────────────────────────
// State (IMPORTANT)
// ─────────────────────────────────────────────
let lastRenderedState = null;

// ─────────────────────────────────────────────
// Render
// ─────────────────────────────────────────────
function render(nowPlayingTabs) {
  // Ignore empty / invalid updates
  if (
    !nowPlayingTabs ||
    typeof nowPlayingTabs !== "object" ||
    Object.keys(nowPlayingTabs).length === 0
  ) {
    if (!lastRenderedState) {
      currentlyPlayingDiv.replaceChildren();
      currentlyPlayingDiv.insertAdjacentHTML(
        "beforeend",
        `<div class="nothing-playing">
          Nothing is playing
          <span>Play a song on Spotify or Youtube Music</span>
        </div>`,
      );
    }
    return;
  }

  lastRenderedState = nowPlayingTabs;

  currentlyPlayingDiv.replaceChildren();

  for (const tabId in nowPlayingTabs) {
    const card = renderSingle(nowPlayingTabs[tabId]);
    currentlyPlayingDiv.appendChild(card);
  }
}

// ─────────────────────────────────────────────
// Initial state request (ONLY ONCE)
// ─────────────────────────────────────────────
browserAPI.runtime
  .sendMessage({ type: "GET_NOW_PLAYING" })
  .then(render)
  .catch(() => {});

// ─────────────────────────────────────────────
// Live updates (ONLY ONCE)
// ─────────────────────────────────────────────
browserAPI.runtime.onMessage.addListener((msg) => {
  if (msg?.type === "NOW_PLAYING_UPDATE") {
    render(msg.payload);
  }
});

// ─────────────────────────────────────────────
// renderSingle
// ─────────────────────────────────────────────
function renderSingle(data) {
  const url = data.song_url;

  const article = document.createElement("article");
  article.innerHTML = /*html*/ `
      <div class="header">
        <div class="image">
          <img src="${data.cover || ""}" isYoutube="${data.cover.includes("i3.ytimg.com") ? "true" : ""}" alt="">
        </div>
        <div class="right">
          <div class="top">Playing on <div class="platform ${data.service}">
            <span><img src="/assets/img/${data.service}.svg"> ${data.service}</span>
          </div>
          <button class="btn-focus" title="Focus on tab"><img src="/assets/img/PixelEyeSolid.svg" alt="Focus on tab"></button>
          <button id="copy-song-link" class="btn-copy" title="Copy song link"><img src="/assets/img/PixelLinkSolid.svg" alt="Copy song link"></button>
          <button id="get-lyrics" class="btn-lyrics" title="Get Lyrics">Lyrics</button>
          </div>
          <div class="title" title="${data.title} - ${data.artist}"><div class="marquee">${data.title} - ${
            data.artist
          }</div></div>
      
        <div class="playbar">
          <button class="btn-prev" title="Previous track"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32"><path d="M5.3 29.3h-4V2.7h4v26.7Zm16-22.6h1.3v2.7h-1.3v1.3H20V12h-1.3v1.3h12v5.3h-12v1.3H20v1.3h1.3v1.3h1.3v2.7h-1.3v1.3h-2.7v-1.3h-1.3v-1.3H16v-1.3h-1.3v-1.3h-1.3V20h-1.3v-1.3h-1.3v-1.3H9.5v-2.7h1.3v-1.3h1.3v-1.3h1.3v-1.3h1.3V9.5H16V8.2h1.3V6.9h1.3V5.6h2.7v1.3Z"/></svg></button>
          <button class="btn-play" title="Play/Pause">
          <div class="play" ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M22 11v2h-1v1h-1v1h-2v1h-2v1h-1v1h-2v1h-2v1h-1v1H8v1H6v1H3v-1H2V2h1V1h3v1h2v1h2v1h1v1h2v1h2v1h1v1h2v1h2v1h1v1z"/></svg></div>
          <div class="pause"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M23 2v20h-1v1h-7v-1h-1V2h1V1h7v1zM9 2h1v20H9v1H2v-1H1V2h1V1h7z"/></svg></div>
          </button>
          <button class="btn-next" title="Next track"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M20 2h3v20h-3zM8 4h2v1h1v1h1v1h1v1h1v1h1v1h1v1h1v2h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1H8v-1H7v-2h1v-1h1v-1h1v-1H1v-4h9V9H9V8H8V7H7V5h1z"/></svg></button>
        </div>

        </div>
      </div>


      <div class="links">
        <a platform="spotify" class="spotify" href="#"  title="Go to Spotify">
          <span>Spotify</span> <img src="/assets/img/spotify.svg" alt="Spotify"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="icon-loading" viewBox="0 0 24 24"><path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path fill="currentColor" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>
        </a>
        <a platform="youtubeMusic" class="youtube-music" href="#" title="Go to YouTube Music">
          <span>YouTube Music</span> <img src="/assets/img/youtube-music.svg" alt="YouTube Music"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="icon-loading" viewBox="0 0 24 24"><path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path fill="currentColor" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>
        </a>
        <a platform="youtube" class="youtube" href="#" title="Go to YouTube">
          <span>YouTube</span> <img src="/assets/img/youtube.svg" alt="YouTube"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="icon-loading" viewBox="0 0 24 24"><path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path fill="currentColor" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>
        </a>
        <a platform="appleMusic" class="apple" href="#" title="Go to Apple Music">
          <span>Apple Music</span> <img src="/assets/img/apple-music.svg" alt="Apple Music"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="icon-loading" viewBox="0 0 24 24"><path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path fill="currentColor" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>
        </a>
        <a platform="deezer" class="deezer" href="#" title="Go to Deezer">
          <span>Deezer</span> <img src="/assets/img/deezer.svg" alt="Deezer"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="icon-loading" viewBox="0 0 24 24"><path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path fill="currentColor" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>
        </a>
        <a platform="soundcloud" class="soundcloud" href="#" title="Go to SoundCloud">
          <span>SoundCloud</span> <img src="/assets/img/soundcloud.svg" alt="SoundCloud"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="icon-loading" viewBox="0 0 24 24"><path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path fill="currentColor" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>
        </a>
        <a platform="amazonMusic" class="amazon-music" href="#" title="Go to Amazon Music">
          <span>Amazon Music</span> <img src="/assets/img/amazon-music.svg" alt="Amazon Music"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="icon-loading" viewBox="0 0 24 24"><path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path fill="currentColor" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>
        </a>
        <a platform="tidal" class="tidal" href="#" title="Go to TIDAL">
          <span>TIDAL</span> <img src="/assets/img/tidal-dark.svg" alt="TIDAL"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="icon-loading" viewBox="0 0 24 24"><path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path fill="currentColor" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>
        </a>
        <a platform="odesli" class="odesli" href="#" title="Go to Odesli">
          <span>Odesli</span> <img src="/assets/img/odesli.svg" alt="Odesli"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="icon-loading" viewBox="0 0 24 24"><path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path fill="currentColor" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>
        </a>
      </div>
      <div class="lyrics-section">
        <button id="copy-lyrics" class="btn-copy-lyrics" title="Copy Lyrics" style="display:none;">Copy Lyrics</button>
        <pre id="lyrics-content" class="lyrics-content"></pre>
      </div>
  `;

  // ───── Links (Songlink) ─────
  const links = article.querySelectorAll(".links a");

  links.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();

      if (btn.hasAttribute("link")) {
        window.open(btn.getAttribute("link"));
        return;
      }

      btn.classList.add("loading");

      try {
        const response = await browserAPI.runtime.sendMessage({
          type: "GET_SONGLINK",
          url,
        });

        btn.classList.remove("loading");

        if (response?.ok && response?.data?.linksByPlatform) {
          const platformLinks = response.data.linksByPlatform;

          links.forEach((otherBtn) => {
            const service = otherBtn.getAttribute("platform");

            if (service === "odesli") {
              otherBtn.setAttribute("link", response.data.pageUrl);
            } else {
              const link = platformLinks[service]?.url;
              if (link) otherBtn.setAttribute("link", link);
            }
          });

          const service = btn.getAttribute("platform");
          const finalLink =
            service === "odesli" ? response.data.pageUrl : platformLinks[service]?.url;

          if (finalLink) window.open(finalLink);
        }
      } catch {
        btn.classList.remove("loading");
      }
    });
  });

  // ───── Playback controls ─────
  article.querySelector(".btn-play").onclick = () => {
    browserAPI.tabs.sendMessage(data.tabId, { type: "TOGGLE_PLAY" });
  };

  article.querySelector(".btn-prev").onclick = () => {
    browserAPI.tabs.sendMessage(data.tabId, { type: "PREVIOUS_TRACK" });
  };

  article.querySelector(".btn-next").onclick = () => {
    browserAPI.tabs.sendMessage(data.tabId, { type: "NEXT_TRACK" });
  };

  article.querySelector(".btn-focus").onclick = () => {
    browserAPI.runtime.sendMessage({ type: "FOCUS_TAB", tabId: data.tabId });
  };

  article.querySelector("#copy-song-link").onclick = () => {
    navigator.clipboard.writeText(url);
  };

  // ───── Lyrics (cached) ─────
  const getLyricsButton = article.querySelector("#get-lyrics");
  const lyricsContent = article.querySelector("#lyrics-content");
  const copyLyricsButton = article.querySelector("#copy-lyrics");

  getLyricsButton.onclick = async () => {
    getLyricsButton.disabled = true;
    lyricsContent.textContent = "Loading lyrics...";
    copyLyricsButton.style.display = "none";

    const cacheKey = `lyrics-${data.title}-${data.artist}`;
    const cached = (await storageGet(cacheKey))[cacheKey];

    if (cached) {
      lyricsContent.textContent = cached;
      copyLyricsButton.style.display = "block";
      getLyricsButton.disabled = false;
      return;
    }

    try {
      const res = await fetch(
        `https://lrclib.net/api/search?track_name=${encodeURIComponent(
          data.title,
        )}&artist_name=${encodeURIComponent(data.artist)}`,
      );
      const json = await res.json();

      if (json?.[0]?.plainLyrics) {
        lyricsContent.textContent = json[0].plainLyrics;
        copyLyricsButton.style.display = "block";
        await storageSet({ [cacheKey]: json[0].plainLyrics });
      } else {
        lyricsContent.textContent = "Lyrics not found.";
      }
    } catch {
      lyricsContent.textContent = "Error loading lyrics.";
    } finally {
      getLyricsButton.disabled = false;
    }
  };

  copyLyricsButton.onclick = () => {
    navigator.clipboard.writeText(lyricsContent.textContent);
  };

  return article;
}
