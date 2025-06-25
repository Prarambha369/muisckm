# Muisckm: Music Project <img src="favicon_io/favicon.ico" align="right" width="32" height="32">

## How It Works

- The UI is defined in `index.html`.
- All music logic is in `script.js` (using Tone.js for synthesis and sequencing).
- The **Download WAV** button uses the [wavefile](https://github.com/rochars/wavefile) library to export the audio.

## Project Structure

```
├── index.html         # Main web page
├── script.js          # Music logic (Tone.js)
├── muisckm.wav        # Example exported WAV (optional)
├── favicon_io/        # Favicon and web manifest
├── LICENSE            # Apache 2.0 License
├── README.md          # This file
└── package.json       # For Node.js (optional, not required for browser use)
```

## Dependencies

- [Tone.js](https://tonejs.github.io/) (loaded via CDN)
- [wavefile](https://github.com/rochars/wavefile) (for WAV export, loaded dynamically)

## Usage as a Template

You can use this project as a starting point for your own browser-based music tools or generative music projects. Just edit `script.js` to change the music logic.


## License

This project is licensed under the [Apache 2.0 License](LICENSE).

---

### Minimal Example: Run Your Own Tone.js Music Script

If you want to run your own music code, use the following template:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tone.js Music Demo</title>
    <script src="https://unpkg.com/tone"></script>
</head>
<body>
    <h1>My Tone.js Composition</h1>
    <button id="playButton">Play Music</button>
    <button id="stopButton">Stop Music</button>
    <script>
        // ...your Tone.js music code here (see script.js for a full example)...
    </script>
</body>
</html>
```

See `script.js` for a complete, production-ready Tone.js music script.

---

**Muisckm** is maintained by [mrbashyal](https://github.com/Prarambha369).
