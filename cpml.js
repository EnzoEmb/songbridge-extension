const DEBUG = true;

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
  });
}

if (location.hostname.includes("youtube.com")) {
  startYoutube();
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
