const DEBUG = false;
console.log("CPML EXTENSION INITED");

DEBUG ? (document.body.style.border = "5px solid red") : null;

/**
 * =========================
 * ENTRY POINT
 * =========================
 */
if (location.hostname.includes("spotify.com")) {
  waitForElement('.contentSpacing [data-testid="top-sentinel"]').then(() => {
    startSpotify();
    observeSpotifyRouteChanges();
    attachSpotifyButtonHandler();
    observerSpotifyNowPlaying();
  });
}

if (location.hostname.includes("youtube.com")) {
  startYoutube();
  attachYoutubeButtonHandler();
  observerYoutubeNowPlaying();
}

/**
 * =========================
 * HELPERS (SHARED)
 * =========================
 */
function waitForElement(selector, root = document.body) {
  return new Promise((resolve) => {
    const el = document.querySelector(selector);
    if (el) {
      resolve(el);
      return;
    }

    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        resolve(el);
      }
    });

    observer.observe(root, {
      childList: true,
      subtree: true,
    });
  });
}

/**
 *
 *
 *
 *
 */

// (function () {
//   function getSpotifyMetadata() {
//     const title = document.querySelector('[data-testid="nowplaying-track-link"]')?.innerText;

//     const artist = document.querySelector('[data-testid="nowplaying-artist"]')?.innerText;

//     const isPlaying = document.querySelector('[data-testid="control-button-pause"]') !== null;

//     if (!title || !artist) return null;

//     return {
//       service: "spotify",
//       title,
//       artist,
//       isPlaying,
//     };
//   }

//   function getYouTubeMusicMetadata() {
//     const title = document.querySelector(".title")?.innerText;
//     const artist = document.querySelector(".subtitle")?.innerText;

//     const isPlaying = document.querySelector('tp-yt-paper-icon-button[title="Pause"]') !== null;

//     if (!title || !artist) return null;

//     return {
//       service: "youtube-music",
//       title,
//       artist,
//       isPlaying,
//     };
//   }

//   function getMetadata() {
//     if (location.hostname.includes("spotify.com")) {
//       return getSpotifyMetadata();
//     }

//     if (location.hostname.includes("music.youtube.com")) {
//       return getYouTubeMusicMetadata();
//     }

//     return null;
//   }

//   function sendUpdate() {
//     const data = getMetadata();
//     console.log({ data });
//     if (!data) return;

//     browser.runtime.sendMessage({
//       type: "NOW_PLAYING",
//       payload: data,
//     });
//   }

//   // Initial send
//   sendUpdate();

//   // Observe DOM changes (song changes)
//   const observer = new MutationObserver(() => {
//     console.log("updated now playing widget");
//     sendUpdate();
//   });

//   observer.observe(document.querySelector('[data-testid="now-playing-widget"]'), {
//     childList: true,
//     subtree: true,
//     characterData: true,
//   });
// })();
