# Haoran Fei — Portfolio

A focused portfolio for my work across autonomous systems, embedded development, full-stack products, and creative technology.

**Live site:** [fhrzz.me](https://fhrzz.me/)

## Music and Opening

The portfolio uses `Home Is Where My Heart Is · Kupla` throughout, with a short moonlit entry, a silent entry option, a persistent player and restrained sound-responsive lighting. Changing sections or language keeps the current playback position. The full track begins at its original opening, with a 5.10-second visual sequence synchronized to its timeline.

The previous Manifold master remains available for explicit comparison builds using `VITE_SOUNDTRACK_PREVIEW=manifold`; `?bgm=original` selects its original master in those builds.

**Finally Home trial:** [fhrzz.me/finally-home-preview](https://fhrzz.me/finally-home-preview/?intro=1), published on 2026-10-03 for phone listening. This is a separate preview URL.

**Replacement listening page:** [fhrzz.me/bgm-listening](https://fhrzz.me/bgm-listening/), published on 2026-10-03 after phone feedback. Four 40-second clips of Midnight Coffee, 脚踏车, Home Is Where My Heart Is and Mechanical Ivy have approximately matched loudness. Playback is manual and one clip pauses the others. This page lets the visitor compare candidates before a new main soundtrack is chosen.

**Home Is Where My Heart Is preview:** [fhrzz.me/home-heart-preview](https://fhrzz.me/home-heart-preview/?intro=1). The retained preview also uses Kupla's full track. The latest intro lands at 4.30 seconds and finishes at 5.10 seconds. The preview retains its earlier player; the main site uses a single speaker icon. Ordinary builds now select Home; the existing `VITE_SOUNDTRACK_PREVIEW=home-heart` flag remains compatible.

- Open the home page to see the entrance. Add `?intro=1` to explicitly replay it.
- Click anywhere on the entrance to start with music, or use the muted-speaker icon to enter silently. Escape or **Skip** opens the page immediately.
- The lower-right speaker icon switches music on or off. The page shows no track title, artist or expanding panel. Existing volume preferences are retained; switching on recovers an old zero-volume setting.
- Reduced-motion preferences disable the ambient movement and shorten the entrance.
- Audio is served as a 192 kbps MP3 rather than the original FLAC.
- The Manifold EQ master keeps the complete stereo track and original timeline. It uses an 80 Hz high-pass, a 180 Hz low shelf at -5 dB, broad boosts at 750 Hz (+3 dB) and 1800 Hz (+1.5 dB), and a small high-frequency reduction. Floating-point processing and oversampled peak limiting avoid intermediate clipping. The final MP3 measures -10.77 LUFS and -1.70 dBTP, with LRA 5.7; the original is -9.87 LUFS with LRA 8.0. Actual phone listening remains a user verification step.
- The Finally Home preview starts at approximately 14 seconds in the original track, matching its first rise to the logo landing. Its trial master uses mild EQ and loudness matching; phone speaker listening still needs user verification.
- Track metadata, volume defaults and opening timing are centralized in `src/v3/V3MusicTrack.ts`. Existing visitor volume preferences are retained.

Building locally does not automatically publish subsequent changes.

## Home preview opening — 2026-10-04

The Home sequence uses a 5.10-second timeline tied to measured transient landmarks in the unchanged MP3: light sweep at 0.69 seconds, outline gathering from 1.29 to 2.41 seconds, flight from 2.93 to 4.30 seconds, followed by the page handoff. SVG drawing follows the media clock instead of an independent animation timer. Hero text, film and editorial copy reveal in short succession. A single warm bloom at 12.08 seconds is limited to a visible hero and respects reduced motion. First published at `https://fhrzz.me/home-heart-preview/?intro=1`, this sequence and soundtrack were promoted to the main site on 2026-10-05. Subsequent browser QA was muted as requested.

## Mobile motion — 2026-10-05

Small screens reveal editorial copy, chapter headings, project media and field notes as each block enters the viewport. One shared observer handles these entrances; at most three new blocks animate together, with no queue that delays fast scrolling. Only transforms and opacity animate, and completed blocks release their temporary animation layers. Existing automatic QR entrances remain visible without a toggle. Touch controls gain a short pressed-state response.

The music control is a transparent, borderless speaker icon with a 48-pixel touch target on mobile and desktop. Hero and field-note videos pause when their actual media window leaves the viewport. The opening measures its destination at most 30 times per second during the header's short reveal, then takes exact landing samples; mobile ambient energy writes run at most 10 times per second. Reduced-motion preferences and hidden tabs stop unnecessary motion. Browser QA uses silent entry; phone hardware frame rate still requires an actual-device check.

## What It Showcases

- Autonomous robotics work with ROS, PX4, Livox, Faster-LIO, and trajectory planning
- Embedded sensing experiments built around STM32
- Full-stack products using Vue, TypeScript, FastAPI, Supabase, and serverless APIs
- Creative coding projects using Three.js, Phaser, Web Audio, and Web MIDI

## Featured Projects

- [Nonconvex-α Standard Drone](https://github.com/1379475267-svg/nonconvex-alpha-standard)
- [RailDrone Mission Studio](https://github.com/1379475267-svg/rail-drone-mission-studio)
- [String Blade](https://github.com/1379475267-svg/String-Blade)
- [GameMemory](https://github.com/1379475267-svg/GameMemory)
- [Fret & Key Theory Lab](https://github.com/1379475267-svg/fretboard-caged-lab)
- [Interactive Particle Saturn](https://github.com/1379475267-svg/interactive-particle-saturn)

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- GitHub Pages

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The production build is generated in `dist/`. The personal domain is hosted on Aliyun; the GitHub Pages workflow remains available for the repository's separate Pages deployment.

## Contact

- [GitHub Profile](https://github.com/1379475267-svg)
- [Email](mailto:1379475267@qq.com)
- [Bilibili](https://space.bilibili.com/19876581)
