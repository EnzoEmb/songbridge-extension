let currentObserver = null;
let lastUrl = location.href;

/**
 * =========================
 * SPOTIFY LOGIC
 * =========================
 */
function startSpotify() {
  console.log("Starting Spotify enhancements");
  const CONTAINER_SELECTOR = document.querySelector(
    '.contentSpacing [data-testid="top-sentinel"] ~ div[role="presentation"]'
  );

  if (!CONTAINER_SELECTOR) return;

  // Disconnect previous observer when re-running
  if (currentObserver) {
    currentObserver.disconnect();
    currentObserver = null;
  }

  /**
   * Process single row
   */
  function processRow(row) {
    const cell = row.querySelector("div[role='gridcell'][aria-colindex='2']");
    if (!cell) return;

    // Prevent duplicate buttons
    if (cell.querySelector(`.btn-ytm`)) return;

    cell.insertAdjacentHTML(
      "afterbegin",
      `
    <button class="btn-ytm" title="Play">
      <svg class="icon" xml:space="preserve" viewBox="0 0 192 192"><path fill="none" d="M0 0h192v192H0z"/><circle cx="96" cy="96" r="88" fill="red"/><path fill="#FFF" d="M96 50.32c25.19 0 45.68 20.49 45.68 45.68S121.19 141.68 96 141.68 50.32 121.19 50.32 96 70.81 50.32 96 50.32m0-6.4c-28.76 0-52.08 23.32-52.08 52.08 0 28.76 23.32 52.08 52.08 52.08s52.08-23.32 52.08-52.08c0-28.76-23.32-52.08-52.08-52.08z"/><path fill="#FFF" d="m79 122 45-26-45-26z"/></svg>
     <svg class="icon-loading" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 1a11 11 0 1 0 11 11A11 11 0 0 0 12 1Zm0 19a8 8 0 0 1-8-8 8 8 0 0 1 8-8Z" opacity=".3"/><path fill="currentColor" d="M10.1 1.2a11 11 0 0 0-9 8.9A1.6 1.6 0 0 0 2.5 12 1.5 1.5 0 0 0 4 10.7a8 8 0 0 1 6.7-6.6A1.4 1.4 0 0 0 12 2.7a1.6 1.6 0 0 0-1.9-1.5Z"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>
    </button>
    `
    );
  }

  /**
   * Process existing rows on load
   */
  function processExistingRows() {
    const rows = CONTAINER_SELECTOR.querySelectorAll("div[role='row'][aria-rowindex]");

    rows.forEach((row) => {
      DEBUG && (row.style.outline = "2px solid blue");
      processRow(row);
    });
  }
  processExistingRows();

  /**
   * Observer containers
   */
  DEBUG ? (CONTAINER_SELECTOR.style = "outline: 3px solid lime") : null;

  const callback = (mutationList) => {
    for (const mutation of mutationList) {
      let newRow = mutation.addedNodes[0];
      if (newRow && newRow.tagName == "DIV" && newRow.hasAttribute("aria-rowindex")) {
        DEBUG ? (newRow.style.outline = "2px solid orange") : null;
        processRow(newRow);
      }
    }
  };

  currentObserver = new MutationObserver(callback);

  currentObserver.observe(CONTAINER_SELECTOR, {
    attributes: false,
    childList: true,
    subtree: true,
  });
}

/**
 * =========================
 * SPOTIFY ROUTE CHANGES
 * =========================
 */
function observeSpotifyRouteChanges() {
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      DEBUG && console.log("Spotify page changed:", lastUrl);

      waitForElement('.contentSpacing [data-testid="top-sentinel"]').then(() => {
        startSpotify();
      });
    }
  }).observe(document.body, {
    childList: true,
    subtree: true,
  });
}

/**
 * =========================
 * SPOTIFY BUTTON HANDLER
 * =========================
 */
function attachSpotifyButtonHandler() {
  document.addEventListener("click", (event) => {
    const btn = event.target.closest(".btn-ytm");
    if (!btn) return;

    if (btn.classList.contains("loading")) return;

    if (btn.hasAttribute("link")) {
      window.open(btn.getAttribute("link"));
      return;
    }

    btn.classList.add("loading");

    const track_url = btn.parentNode.querySelector("a").href;
    const track_id = track_url.match(/track\/([A-Za-z0-9]+)/)?.[1];
    if (!track_id) return;

    const runtime = chrome?.runtime || browser?.runtime;

    runtime.sendMessage({ type: "GET_YT_MUSIC", track_id }, (response) => {
      btn.classList.remove("loading");

      if (response?.ytMusicLink) {
        window.open(response.ytMusicLink);
        btn.setAttribute("link", response.ytMusicLink);
      }
    });
  });
}
