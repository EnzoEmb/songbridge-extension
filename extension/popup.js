console.log("Popup opened");

browser.runtime.onMessage.addListener((msg) => {
  if (msg.type === "NOW_PLAYING_UPDATE") {
    console.log(msg);
  }
});
