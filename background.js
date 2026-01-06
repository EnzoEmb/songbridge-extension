browser.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === "GET_YT_MUSIC") {
    const apiUrl = `https://api.song.link/v1-alpha.1/links?url=spotify:track:${msg.track_id}&songIfSingle=true`;

    return fetch(apiUrl)
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

  if (msg.type === "GET_SPO_MUSIC") {
    // Accept either a video ID or full URL
    const ytUrl = msg.video_id.startsWith("http")
      ? msg.video_id
      : `https://www.youtube.com/watch?v=${msg.video_id}`;

    const apiUrl = `https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(
      ytUrl
    )}&songIfSingle=true`;

    return fetch(apiUrl)
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
