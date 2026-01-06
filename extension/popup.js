console.log("Popup opened");

const currentlyPlayingDiv = document.querySelector(".currently-playing");

function render(data) {
  if (!data) {
    currentlyPlayingDiv.innerHTML = "Nothing is playing";
    return;
  }

  currentlyPlayingDiv.innerHTML = `
    <div>
      <div class="image">
        <img src="${data.cover || ""}" alt="">
      </div>
      <div class="right">
        <div class="top">Currently ${data.isPlaying ? "playing" : "paused"}:</div>
        <div class="title">${data.title} - ${data.artist}</div>
        <div class="platform">on
          <span><img src="/assets/img/${data.service}.svg"> ${data.service}</span>
        </div>
      </div>
    </div>
  `;
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
