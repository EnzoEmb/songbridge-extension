const DEBUG = true;

DEBUG ? (document.body.style.border = "5px solid red") : null;

function start() {
  const CONTAINER_SELECTOR = document.querySelector(
    '.contentSpacing [data-testid="top-sentinel"] ~ div[role="presentation"]'
  );

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
      <svg class="icon" viewBox="0 0 192 192" width="14" height="14" aria-hidden="true">
      <circle cx="96" cy="96" r="88" fill="red"/>
      <path fill="#fff" d="m79 122 45-26-45-26z"/>
      </svg>
     <svg class="icon-loading" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 1a11 11 0 1 0 11 11A11 11 0 0 0 12 1Zm0 19a8 8 0 1 1 8-8 8 8 0 0 1-8 8Z" opacity=".3"/><path fill="currentColor" d="M10.1 1.2a11 11 0 0 0-9 8.9A1.6 1.6 0 0 0 2.5 12 1.5 1.5 0 0 0 4 10.7a8 8 0 0 1 6.7-6.6A1.4 1.4 0 0 0 12 2.7a1.6 1.6 0 0 0-1.9-1.5Z"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>
    </button>
    `
    );
  }

  /**
   * Observer containers
   */
  DEBUG ? (CONTAINER_SELECTOR.style = "outline: 3px solid lime") : null;

  // Callback function to execute when mutations are observed
  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      let newRow = mutation.addedNodes[0];
      if (newRow && newRow.tagName == "DIV" && newRow.hasAttribute("aria-rowindex")) {
        DEBUG ? (newRow.style.outline = "2px solid orange") : null;
        processRow(newRow);
      }
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(CONTAINER_SELECTOR, { attributes: false, childList: true, subtree: true });

  /**
   * Button click handler
   */
  document.addEventListener("click", (event) => {
    const btn = event.target.closest(".btn-ytm");
    if (!btn) return;
    btn.classList.add("loading");

    const track_url = btn.parentNode.querySelector("a").href;
    const track_id = track_url.match(/track\/([A-Za-z0-9]+)/)?.[1];
    if (!track_id) return;

    const runtime = chrome?.runtime || browser?.runtime;

    runtime.sendMessage({ type: "GET_YT_MUSIC", track_id }, (response) => {
      btn.classList.remove("loading");

      if (response?.ytMusicLink) {
        window.open(response.ytMusicLink);
      }
    });
  });
}

/**
 * Helpers
 */
waitForElement('.contentSpacing [data-testid="top-sentinel"]').then((container) => {
  console.log("Container ready:", container);
  start();
});

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
