const browserAPI = browser;
const currentlyPlayingDiv = document.querySelector(".currently-playing");
const manifest = browser.runtime.getManifest();
const version = manifest.version;

console.log("Popup opened");

document.querySelector(".version").innerText = `v${version}`;

function render(nowPlayingTabs) {
  console.log("render data", nowPlayingTabs);
  if (!nowPlayingTabs || Object.keys(nowPlayingTabs).length === 0) {
    currentlyPlayingDiv.replaceChildren();
    currentlyPlayingDiv.insertAdjacentHTML(
      "beforeend",
      '<div class="nothing-playing">Nothing is playing <span>Play a song on Spotify or Youtube Music</span></div>',
    );
    return;
  }

  currentlyPlayingDiv.replaceChildren();
  for (const tabId in nowPlayingTabs) {
    const nowPlaying = nowPlayingTabs[tabId];
    const card = renderSingle(nowPlaying);
    currentlyPlayingDiv.appendChild(card);
  }
}

function renderSingle(data) {
  const url = data.song_url;

  console.log("Popup Now Playing Data", data);

  const article = document.createElement("article");
  article.innerHTML = /*html*/ `
      <div class="header">
        <div class="image">
          <img src="${data.cover || ""}" alt="">
        </div>
        <div class="right">
          <div class="top">Playing on <div class="platform ${data.service}">
            <span><img src="/assets/img/${data.service}.svg"> ${data.service}</span>
          </div>
          <button class="btn-focus" title="Focus tab"><img src="/assets/img/PixelEyeSolid.svg" alt="Focus tab"></button>
          <button id="copy-song-link" class="btn-copy" title="Copy song link"><img src="/assets/img/PixelLinkSolid.svg" alt="Copy song link"></button>
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
  `;
  // button handlers
  const links = article.querySelectorAll(".links a");
  links.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("requesting link,", url);

      //if link open, otherwise fetch
      if (btn.hasAttribute("link")) {
        window.open(btn.getAttribute("link"));
        return;
      }

      btn.classList.add("loading");

      browserAPI.runtime.sendMessage({ type: "GET_SONGLINK", url }).then((response) => {
        btn.classList.remove("loading");

        // add links to all buttons
        if (response?.ok && response?.data?.linksByPlatform) {
          const platformLinks = response.data.linksByPlatform;
          const service = btn.getAttribute("platform");
          const link = platformLinks[service]?.url;
          if (link) {
            window.open(link);
            btn.setAttribute("link", link);
          }

          // set links for other buttons too
          links.forEach((otherBtn) => {
            const service = otherBtn.attributes["platform"].value;
            const link = platformLinks[service]?.url;
            if (service === "odesli") {
              otherBtn.setAttribute("link", response.data.pageUrl);
            } else {
              if (link) {
                otherBtn.setAttribute("link", link);
              }
            }
          });
        }
      });
    });
  });

  // playbar handlers
  const playButton = article.querySelector(".btn-play");
  const previousButton = article.querySelector(".btn-prev");
  const nextButton = article.querySelector(".btn-next");
  playButton.onclick = () => {
    chrome.tabs.sendMessage(data.tabId, { type: "TOGGLE_PLAY" });
    playButton.classList.toggle("paused");
  };
  previousButton.onclick = () => {
    chrome.tabs.sendMessage(data.tabId, { type: "PREVIOUS_TRACK" });
  };
  nextButton.onclick = () => {
    chrome.tabs.sendMessage(data.tabId, { type: "NEXT_TRACK" });
  };

  const focusButton = article.querySelector(".btn-focus");
  focusButton.onclick = () => {
    browserAPI.runtime.sendMessage({ type: "FOCUS_TAB", tabId: data.tabId });
  };

  const copyButton = article.querySelector("#copy-song-link");
  copyButton.onclick = () => {
    navigator.clipboard.writeText(url);
  };

  return article;
}

/* 1️⃣ Request state when popup opens */
browserAPI.runtime
  .sendMessage({ type: "GET_NOW_PLAYING" })
  .then(render)
  .catch(() => {
    render(null);
  });

/* 2️⃣ Listen for live updates (optional) */
browserAPI.runtime.onMessage.addListener((msg) => {
  if (msg.type === "NOW_PLAYING_UPDATE") {
    render(msg.payload);
  }
});
