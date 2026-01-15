console.log("Popup opened");

const currentlyPlayingDiv = document.querySelector(".currently-playing");

function render(data) {
  if (!data) {
    currentlyPlayingDiv.innerHTML = "Nothing is playing";
    return;
  }
  const url = data.song_url;

  // console.log("Popup Data", data);

  currentlyPlayingDiv.innerHTML = `
    <div>
      <div class="header">
        <div class="image">
          <img src="${data.cover || ""}" alt="">
        </div>
        <div class="right">
          <div class="top">Playing on <div class="platform ${data.service}">
            <span><img src="/assets/img/${data.service}.svg"> ${data.service}</span>
          </div></div>
          <div class="title" title="${data.title} - ${data.artist}">${data.title} - ${
    data.artist
  }</div>
      
        </div>
      </div>

      <div class="links">
        <a platform="spotify" class="spotify" href="#"  title="Go to Spotify">
          Spotify <img src="/assets/img/spotify.svg" alt="Spotify"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="icon-loading" viewBox="0 0 24 24"><path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path fill="currentColor" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>
        </a>
        <a platform="youtubeMusic" class="youtube-music" href="#" title="Go to YouTube Music">
          YouTube Music <img src="/assets/img/youtube-music.svg" alt="YouTube Music"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="icon-loading" viewBox="0 0 24 24"><path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path fill="currentColor" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>
        </a>
        <a platform="youtube" class="youtube" href="#" title="Go to YouTube">
          YouTube <img src="/assets/img/youtube.svg" alt="YouTube"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="icon-loading" viewBox="0 0 24 24"><path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path fill="currentColor" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>
        </a>
        <a platform="appleMusic" class="apple" href="#" title="Go to Apple Music">
          Apple Music <img src="/assets/img/apple-music.svg" alt="Apple Music"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="icon-loading" viewBox="0 0 24 24"><path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path fill="currentColor" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>
        </a>
        <a platform="deezer" class="deezer" href="#" title="Go to Deezer">
          Deezer <img src="/assets/img/deezer.svg" alt="Deezer"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="icon-loading" viewBox="0 0 24 24"><path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path fill="currentColor" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>
        </a>
        <a platform="soundcloud" class="soundcloud" href="#" title="Go to SoundCloud">
          SoundCloud <img src="/assets/img/soundcloud.svg" alt="SoundCloud"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="icon-loading" viewBox="0 0 24 24"><path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path fill="currentColor" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>
        </a>
        <a platform="amazonMusic" class="amazon-music" href="#" title="Go to Amazon Music">
          Amazon Music <img src="/assets/img/amazon-music.svg" alt="Amazon Music"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="icon-loading" viewBox="0 0 24 24"><path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path fill="currentColor" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>
        </a>
        <a platform="tidal" class="tidal" href="#" title="Go to TIDAL">
          TIDAL <img src="/assets/img/tidal-dark.svg" alt="TIDAL"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="icon-loading" viewBox="0 0 24 24"><path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path fill="currentColor" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>
        </a>
        <a platform="odesli" class="odesli" href="#" title="Go to Odesli">
          Odesli <img src="/assets/img/odesli.svg" alt="Odesli"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="icon-loading" viewBox="0 0 24 24"><path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path fill="currentColor" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>
        </a>
      </div>
    </div>
  `;

  // button handlers
  const links = currentlyPlayingDiv.querySelectorAll(".links a");
  links.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      btn.classList.add("loading");

      console.log("requesting link,", url);

      //if link open, otherwise fetch
      if (btn.hasAttribute("link")) {
        window.open(btn.getAttribute("link"));
        return;
      }

      browser.runtime.sendMessage({ type: "GET_SONGLINK", url }).then((response) => {
        btn.classList.remove("loading");

        // add links to all buttons
        if (response?.ok && response?.data?.linksByPlatform) {
          const platformLinks = response.data.linksByPlatform;
          const service = btn.className;
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
}

/* 1️⃣ Request state when popup opens */
browser.runtime
  .sendMessage({ type: "GET_NOW_PLAYING" })
  .then(render)
  .catch(() => {
    render(null);
  });

/* 2️⃣ Listen for live updates (optional) */
browser.runtime.onMessage.addListener((msg) => {
  if (msg.type === "NOW_PLAYING_UPDATE") {
    render(msg.payload);
  }
});
