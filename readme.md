<p align="center">
<img alt="songbridge" src="icon.png" width="180">
</p>

<p align="center">
Adds utilities to music streaming web apps, currently Spotify and Youtube Music.
</p>

<p align="center">
  <a href="https://addons.mozilla.org/firefox/addon/songbridge/" target="_blank"><img alt="Firefox Add-on" src="https://img.shields.io/amo/v/songbridge?style=for-the-badge" href="https://addons.mozilla.org/firefox/addon/songbridge/"></a>
  <a href="https://chromewebstore.google.com/detail/epcehkbnafmjfkegnfoiblkheldeagoi?utm_source=item-share-cb" target="_blank"><img alt="Chrome Web Store" src="https://img.shields.io/chrome-web-store/v/epcehkbnafmjfkegnfoiblkheldeagoi?style=for-the-badge" ></a>

</p>

## Features

🎧 **Cross-platform shortcuts**  
Open the same song instantly on **YouTube Music ↔ Spotify** with a single click.

🔗 **Smart universal links**  
Get quick links to the currently playing song on **Spotify, YouTube Music, Apple Music, Deezer, SoundCloud, TIDAL**, and more.

⏯️ **Popup player controls**  
Play, pause, skip, or go back directly from the extension popup — no tab switching needed.

🎤 **Lyrics on demand**  
Fetch and view song lyrics right from the popup, with one-click copy support.

👀 **Tab focus & utilities**  
Jump to the playing tab instantly, copy song links, and manage multiple active players.

## API

Songbridge uses multiple public APIs to enhance the music experience:

- 🔗 **Songlink / Odesli API**  
  Used to fetch cross-platform links for the currently playing song  
  (Spotify, YouTube Music, Apple Music, Deezer, SoundCloud, TIDAL, and more).  
  The API allows up to **10 requests per minute**, which is sufficient for normal usage.

- 🎤 **LRCLIB API**  
  Used to search and retrieve **song lyrics** based on track title and artist.  
  Lyrics are fetched on demand and cached locally to reduce repeated requests.

## Screens

<p align="center">
<img alt="songbridge" src="repo-og.png">
</p>

## Changelog

**[0.7]**

- 🎤 Added lyrics support (view & copy from popup)

**[0.6]**

- 🎨 Improved styles and UI polish
- ⏯️ Added player controls (play / pause / next / previous)
- 🎧 Support for multiple simultaneously playing tabs
- 👀 Added focus tab & copy link buttons
- ⚙️ Improved YouTube Music detection algorithm

**[0.5]**

- 🧹 Removed unused permissions
- ℹ️ Added version info display

**[0.3 - 0.4]**

- 🛠️ Extension submission fixes

**[0.2]**

- 🎶 Added currently playing popup

**[0.1]**

- 🚀 Initial demo release
