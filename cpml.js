document.body.style.border = "5px solid red";

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
      <svg viewBox="0 0 192 192" width="14" height="14" aria-hidden="true">
      <circle cx="96" cy="96" r="88" fill="red"/>
      <path fill="#fff" d="m79 122 45-26-45-26z"/>
      </svg>
    </button>
    `
    );
  }

  /**
   * Observer containers
   */
  CONTAINER_SELECTOR.style = "outline: 3px solid lime";

  // Callback function to execute when mutations are observed
  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      let newRow = mutation.addedNodes[0];
      if (newRow && newRow.tagName == "DIV" && newRow.hasAttribute("aria-rowindex")) {
        newRow.style.outline = "2px solid orange";
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
    const track_url = btn.parentNode.querySelector("a").href;
    const track_id = track_url.match(/track\/([A-Za-z0-9]+)/)?.[1] ?? null;
    if (btn) {
      console.log(track_url);
      console.log(track_id);
    }
  });
}

/**
 * Wait for container to be available
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
