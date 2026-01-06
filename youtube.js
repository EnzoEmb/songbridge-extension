function startYoutube() {
  console.log("Starting YouTube enhancements");
  processRows();
}

function processRows() {
  const songs_row = document.querySelectorAll("ytmusic-responsive-list-item-renderer");
  console.log(songs_row);
  songs_row.forEach((row) => {
    row.style.outline = "2px solid purple";
    // Additional processing logic can be added here
  });
}
