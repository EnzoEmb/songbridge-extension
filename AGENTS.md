This is a browser extension.
Should work in Firefox and Chrome.
dont use git commands.
dont use npm commands.
dont worry about css styling. keep it simple and make it last priority.

The extension has the following functions:

- Adds a button to Spotify and YouTube Music web apps to get cross-platform music links.
- Observes the currently playing song and provides quick access to links.
  It uses the Songlink/Odesli API to fetch cross-platform music links.
- **Refactor to Support Multiple "Now Playing" Cards**:
  - **background.js**: Modified the storage logic to handle a
    owPlayingTabs object, allowing the extension to track multiple songs playing in different tabs simultaneously. The script now adds, updates, and removes entries from this object as music starts or stops, and broadcasts the entire collection to the popup.
  - **popup.js**: Reworked the UI rendering to iterate through the
    owPlayingTabs object and display a separate "now playing" card for each song. This includes creating a
    enderSingle function to handle the generation of individual cards and attaching the necessary event listeners for playback controls and service links.
