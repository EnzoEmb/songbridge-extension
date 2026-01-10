let ytCurrentObserver = null;

function startYoutube() {
  console.log("Starting YouTube enhancements");
  processRows();
  observeYoutubeContentChanges();
}

function processRows() {
  const songs_row = document.querySelectorAll("ytmusic-responsive-list-item-renderer");
  // console.log(songs_row);
  songs_row.forEach((row) => {
    if (row.hasAttribute("data-cpml")) return;

    row.setAttribute("data-cpml", "true");

    if (DEBUG) {
      row.style.outline = "2px solid purple";
    }

    row.insertAdjacentHTML(
      "afterbegin",
      `
    <button class="btn-spo" title="Open in Spotify">
      <svg class="icon" viewBox="0 0 256 256" preserveAspectRatio="xMidYMid"><path d="M128 0C57.308 0 0 57.309 0 128c0 70.696 57.309 128 128 128 70.697 0 128-57.304 128-128C256 57.314 198.697.007 127.998.007l.001-.006Zm58.699 184.614c-2.293 3.76-7.215 4.952-10.975 2.644-30.053-18.357-67.885-22.515-112.44-12.335a7.981 7.981 0 0 1-9.552-6.007 7.968 7.968 0 0 1 6-9.553c48.76-11.14 90.583-6.344 124.323 14.276 3.76 2.308 4.952 7.215 2.644 10.975Zm15.667-34.853c-2.89 4.695-9.034 6.178-13.726 3.289-34.406-21.148-86.853-27.273-127.548-14.92-5.278 1.594-10.852-1.38-12.454-6.649-1.59-5.278 1.386-10.842 6.655-12.446 46.485-14.106 104.275-7.273 143.787 17.007 4.692 2.89 6.175 9.034 3.286 13.72v-.001Zm1.345-36.293C162.457 88.964 94.394 86.71 55.007 98.666c-6.325 1.918-13.014-1.653-14.93-7.978-1.917-6.328 1.65-13.012 7.98-14.935C93.27 62.027 168.434 64.68 215.929 92.876c5.702 3.376 7.566 10.724 4.188 16.405-3.362 5.69-10.73 7.565-16.4 4.187h-.006Z" fill="#1ED760"/></svg>
     <svg class="icon-loading" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d="M12 1a11 11 0 1 0 11 11A11 11 0 0 0 12 1Zm0 19a8 8 0 0 1-8-8 8 8 0 0 1 8-8Z" opacity=".3"/><path fill="white" d="M10.1 1.2a11 11 0 0 0-9 8.9A1.6 1.6 0 0 0 2.5 12 1.5 1.5 0 0 0 4 10.7a8 8 0 0 1 6.7-6.6A1.4 1.4 0 0 0 12 2.7a1.6 1.6 0 0 0-1.9-1.5Z"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>
    </button>
    `
    );
  });
}

function observeYoutubeContentChanges() {
  const contents = document.querySelector("#contents");
  if (!contents) return;

  if (ytCurrentObserver) {
    ytCurrentObserver.disconnect();
  }

  const callback = (mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        processRows();
        break;
      }
    }
  };

  ytCurrentObserver = new MutationObserver(callback);
  ytCurrentObserver.observe(contents, { childList: true, subtree: true });
}

function attachYoutubeButtonHandler() {
  document.addEventListener("click", (event) => {
    const btn = event.target.closest(".btn-spo");
    if (!btn) return;

    if (btn.classList.contains("loading")) return;

    if (btn.hasAttribute("link")) {
      window.open(btn.getAttribute("link"));
      return;
    }

    btn.classList.add("loading");

    const track_url = btn.parentNode.querySelector("a").href;
    const video_id = new URL(track_url).searchParams.get("v");
    if (!video_id) return;

    const runtime = chrome?.runtime || browser?.runtime;

    runtime.sendMessage({ type: "GET_SPO_MUSIC", video_id }, (response) => {
      btn.classList.remove("loading");

      if (response?.spotifyLink) {
        window.open(response.spotifyLink);
        btn.setAttribute("link", response.spotifyLink);
      }
    });
  });
}

function observerYoutubeNowPlaying() {
  function getYoutubeMetadata() {
    const title = document.querySelector(".title.ytmusic-player-bar")?.innerText;

    const artist = document.querySelector(".subtitle .byline > a:first-child")?.innerText;

    const song_url = [...document.querySelectorAll("ytmusic-responsive-list-item-renderer a")].find(
      (a) => a.textContent.trim() === title
    ).href;

    // const isPlaying = document.querySelector(
    //   '[data-testid="control-button-playpause"] svg path[d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7z"]'
    // )
    //   ? true
    //   : false;

    const cover = document.querySelector(".thumbnail-image-wrapper img")?.src;

    if (!title || !artist) return null;

    return {
      service: "youtube-music",
      title,
      artist,
      cover,
      song_url,
      // isPlaying,
    };
  }

  function sendUpdate() {
    console.log("updated now playing widget YOUTUBE");
    const data = getYoutubeMetadata();
    console.log("sendUpdate", { data });
    if (!data) return;

    browser.runtime.sendMessage({
      type: "NOW_PLAYING",
      payload: data,
    });
  }

  // Initial send
  sendUpdate();

  // Observe DOM changes (song changes)
  const observer = new MutationObserver(() => {
    sendUpdate();
  });

  observer.observe(document.querySelector(".ytmusic-player-bar .content-info-wrapper"), {
    childList: true,
    subtree: true,
    characterData: true,
  });
}
