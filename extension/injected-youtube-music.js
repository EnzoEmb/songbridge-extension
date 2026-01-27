/**
 * Script injected into YouTube Music pages
 */
(function () {
  console.log("injected-youtube-music.js");
  let last = {
    videoId: null,
    title: null,
  };

  function getNowPlaying() {
    const player = document.querySelector("ytmusic-player");
    const data = player?.playerApi?.getVideoData?.();

    if (!data?.video_id) return null;

    return {
      videoId: data.video_id,
      title: data.title || null,
      artist: data.author || null,
      url: `https://music.youtube.com/watch?v=${data.video_id}`,
    };
  }

  function hasChanged(current) {
    return current.videoId !== last.videoId || current.title !== last.title;
  }

  function tick() {
    const current = getNowPlaying();

    if (current && hasChanged(current) && current.title) {
      last = {
        videoId: current.videoId,
        title: current.title,
      };

      console.log("sending np from ytm", current);

      window.postMessage(
        {
          source: "songbridge",
          type: "YTM_NOW_PLAYING",
          payload: current,
        },
        "*",
      );
    }

    requestAnimationFrame(tick);
  }

  tick();
})();
