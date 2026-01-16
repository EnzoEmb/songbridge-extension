let storageArea;

if (chrome.storage && chrome.storage.session) {
  // Chrome MV3
  storageArea = chrome.storage.session;
} else {
  // Firefox MV2
  storageArea = chrome.storage.local;
}

function storageGet(key) {
  return new Promise((resolve) => {
    storageArea.get(key, (result) => {
      resolve(result);
    });
  });
}

function storageSet(obj) {
  return new Promise((resolve) => {
    storageArea.set(obj, resolve);
  });
}

function storageRemove(key) {
  return new Promise((resolve) => {
    storageArea.remove(key, resolve);
  });
}

function sendMessageAsync(message) {
  return new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage(message, (response) => {
        const err = chrome.runtime.lastError;
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

let songLinkCache = new Map();

/* ===========================
   MESSAGE HANDLER (PROMISE-BASED)
=========================== */
chrome.runtime.onMessage.addListener((msg, sender) => {
  /* 🎵 NOW PLAYING UPDATE */
  if (msg.type === "NOW_PLAYING") {
    return storageGet("nowPlaying").then(({ nowPlaying }) => {
      if (nowPlaying?.song_url === msg.payload.song_url) return;

      const updated = {
        ...msg.payload,
        tabId: sender.tab?.id,
        url: sender.tab?.url,
        timestamp: Date.now(),
      };

      return storageSet({ nowPlaying: updated }).then(() => {
        broadcast(updated);
      });
    });
  }

  /* 📥 GET NOW PLAYING */
  if (msg.type === "GET_NOW_PLAYING") {
    return storageGet("nowPlaying").then((r) => r.nowPlaying || null);
  }

  /* 🔗 GET SONGLINK */
  if (msg.type === "GET_SONGLINK") {
    if (songLinkCache.has(msg.url)) {
      return Promise.resolve({
        ok: true,
        data: songLinkCache.get(msg.url),
        cached: true,
      });
    }

    return fetch(`https://api.song.link/v1-alpha.1/links?url=${msg.url}`)
      .then((r) => r.json())
      .then((data) => {
        songLinkCache.set(msg.url, data);
        return { ok: true, data, cached: false };
      })
      .catch((err) => ({
        ok: false,
        error: err.toString(),
      }));
  }

  /* 🎧 GET YT MUSIC FROM SPOTIFY */
  if (msg.type === "GET_YT_MUSIC") {
    return fetch(
      `https://api.song.link/v1-alpha.1/links?url=spotify:track:${msg.track_id}&songIfSingle=true`
    )
      .then((r) => r.json())
      .then((data) => ({
        ok: true,
        ytMusicLink: data.linksByPlatform?.youtubeMusic?.url || null,
      }))
      .catch((err) => ({
        ok: false,
        error: err.toString(),
      }));
  }

  /* 🎵 GET SPOTIFY FROM YOUTUBE */
  if (msg.type === "GET_SPO_MUSIC") {
    const ytUrl = msg.video_id.startsWith("http")
      ? msg.video_id
      : `https://www.youtube.com/watch?v=${msg.video_id}`;

    return fetch(
      `https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(ytUrl)}&songIfSingle=true`
    )
      .then((r) => r.json())
      .then((data) => ({
        ok: true,
        spotifyLink: data.linksByPlatform?.spotify?.url || null,
      }))
      .catch((err) => ({
        ok: false,
        error: err.toString(),
      }));
  }
});

/* ===========================
   SAFE BROADCAST
=========================== */
function broadcast(nowPlaying) {
  sendMessageAsync({
    type: "NOW_PLAYING_UPDATE",
    payload: nowPlaying,
  }).catch(() => {
    // Popup not open → ignore
  });
}

/* ===========================
   TAB EVENTS
=========================== */
chrome.tabs.onRemoved.addListener((tabId) => {
  storageGet("nowPlaying").then(({ nowPlaying }) => {
    if (nowPlaying?.tabId === tabId) {
      storageRemove("nowPlaying");
      broadcast(null);
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "loading") {
    storageGet("nowPlaying").then(({ nowPlaying }) => {
      if (nowPlaying?.tabId === tabId) {
        storageRemove("nowPlaying");
        broadcast(null);
      }
    });
  }
});
