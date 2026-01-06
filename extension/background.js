const browserAPI = typeof browser !== "undefined" ? browser : chrome;

browserAPI.runtime.onMessage.addListener((msg, sender, sendResponse) => {
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
