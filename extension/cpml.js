const browserAPI = browser;
const DEBUG = false;
const manifest = browser.runtime.getManifest();
const version = manifest.version;
console.log("SONGBRIDGE v" + version + " EXTENSION INITED");

DEBUG ? (document.body.style.border = "5px solid red") : null;

/**
 * =========================
 * ENTRY POINT
 * =========================
 */
if (location.hostname.includes("spotify.com")) {
  waitForElement('.contentSpacing [data-testid="top-sentinel"]').then(() => {
    startSpotify();
  });
}

if (location.hostname.includes("youtube.com")) {
  waitForElement("#contents").then(() => {
    startYTM();
  });
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
