# Privacy Policy

## Overview

SongBridge is a browser extension that helps users navigate between music streaming platforms by detecting the currently playing song, generating cross-platform links, and optionally displaying lyrics.

The extension collects **no personally identifiable information**.

---

## Information Collected

### 1. Personal Data

SongBridge **does not collect, store, or transmit** any personally identifiable information (PII).

This includes, but is not limited to:

- Names
- Email addresses
- Account credentials
- IP addresses
- User identifiers
- Browsing history outside supported music platforms

---

### 2. Music Metadata (Local Processing)

While a supported music site is open, the extension temporarily reads **publicly available music metadata**, such as:

- Song title
- Artist name
- Album artwork
- Track URL

This data:

- Is processed **locally in the browser**
- May be cached **locally** to improve performance and reduce duplicate requests
- Is **not linked to a user identity**
- Is never transmitted except as described below

---

### 3. Third-Party API Usage

#### Songlink / Odesli API

To generate cross-platform music links, SongBridge sends **only the song URL** to the **Songlink (Odesli) public API**.

- No personal data is sent
- No user identifiers are included
- Responses may be **cached locally** to minimize repeated API calls

Use of the Songlink API is subject to their Terms of Service:  
https://song.link

---

#### LRCLIB API (Lyrics)

When the user requests lyrics, SongBridge sends **only the song title and artist name** to the **LRCLIB public API**.

- No personal data or identifiers are sent
- Lyrics are fetched **on demand only**
- Retrieved lyrics may be **cached locally in the browser** to avoid repeated lookups

Use of the LRCLIB API is subject to their terms:  
https://lrclib.net

---

## Data Storage

- All caching is performed **locally on the user’s device**
- No remote databases are used
- No long-term user profiles are created
- No analytics or tracking data is collected

SongBridge does **not** sync, upload, or share stored data.

---

## Permissions Explanation

SongBridge requests only the minimum permissions required for functionality:

- **Site access (supported music platforms only)**  
  Used to detect currently playing music

- **Network access**  
  Used to request song links (Songlink/Odesli) and lyrics (LRCLIB)

No permissions are used for advertising, tracking, or analytics.

---

## Data Sharing

SongBridge does **not**:

- Sell user data
- Share data with advertisers
- Use trackers, cookies, or fingerprinting
- Share data with third parties beyond the APIs explicitly described above

---

## Attribution & Third-Party Content

Song metadata, lyrics, and platform links remain the property of their respective owners and providers.

SongBridge displays this content **solely for user convenience** and does not claim ownership of any third-party material.
