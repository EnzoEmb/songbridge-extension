const browserAPI = typeof browser !== "undefined" ? browser : chrome;

let nowPlaying = null;
const songLinkCache = new Map();

browserAPI.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "NOW_PLAYING" && nowPlaying?.song_url !== msg.payload.song_url) {
    nowPlaying = {
      ...msg.payload,
      tabId: sender.tab.id,
      url: sender.tab.url,
      timestamp: Date.now(),
    };
    console.log("Now playing:", nowPlaying);
    broadcast();
  }

  if (msg.type === "GET_NOW_PLAYING") {
    sendResponse(nowPlaying);
  }

  if (msg.type === "GET_SONGLINK") {
    const apiUrl = `https://api.song.link/v1-alpha.1/links?url=${msg.url}`;
    // 1️⃣ Return cached result if available
    if (songLinkCache.has(msg.url)) {
      sendResponse({
        ok: true,
        data: songLinkCache.get(msg.url),
        cached: true,
      });
      return; // IMPORTANT: no async
    }

    // 2️⃣ Otherwise fetch from API

    fetch(apiUrl)
      .then((r) => r.json())
      .then((data) => {
        // Cache result
        songLinkCache.set(msg.url, data);

        sendResponse({
          ok: true,
          data: data || null,
          cached: false,
        });
      })
      .catch((err) => {
        sendResponse({
          ok: false,
          error: err.toString(),
        });
      });

    return true;
  }

  if (msg.type === "GET_YT_MUSIC") {
    const apiUrl = `https://api.song.link/v1-alpha.1/links?url=spotify:track:${msg.track_id}&songIfSingle=true`;

    fetch(apiUrl)
      .then((r) => r.json())
      .then((data) => {
        sendResponse({
          ok: true,
          ytMusicLink: data.linksByPlatform?.youtubeMusic?.url || null,
        });
      })
      .catch((err) => {
        sendResponse({
          ok: false,
          error: err.toString(),
        });
      });

    return true;
  }

  if (msg.type === "GET_SPO_MUSIC") {
    const ytUrl = msg.video_id.startsWith("http")
      ? msg.video_id
      : `https://www.youtube.com/watch?v=${msg.video_id}`;

    const apiUrl = `https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(
      ytUrl
    )}&songIfSingle=true`;

    fetch(apiUrl)
      .then((r) => r.json())
      .then((data) => {
        sendResponse({
          ok: true,
          spotifyLink: data.linksByPlatform?.spotify?.url || null,
        });
      })
      .catch((err) => {
        sendResponse({
          ok: false,
          error: err.toString(),
        });
      });

    return true;
  }
});

/**
 * Now playing broadcaster
 */
function broadcast() {
  browser.runtime
    .sendMessage({
      type: "NOW_PLAYING_UPDATE",
      payload: nowPlaying,
    })
    .catch(() => {});
}

browserAPI.tabs.onRemoved.addListener((tabId, removeInfo) => {
  console.log("tab REMOVED");
  if (nowPlaying && tabId === nowPlaying.tabId) {
    nowPlaying = null;
    broadcast();
  }
});

browserAPI.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Reload detected
  if (changeInfo.status === "loading" && tab.url) {
    console.log("Tab reloading:", tabId, tab.url);

    // Example: clear nowPlaying if its tab reloads
    if (nowPlaying && tabId === nowPlaying.tabId) {
      nowPlaying = null;
      broadcast();
    }
  }
});
