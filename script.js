const BPM = 144;
Tone.Transport.bpm.value = BPM;

// --- Global sequences and parts for playback ---
let drums, bassLine, guitarArp, stringPart, pianoPart, harpArp, lowDownSeq;

// --- Setup global synths for playback ---
const kick = new Tone.MembraneSynth({
  pitchDecay: 0.05,
  octaves: 10,
  envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 }
}).toDestination();
kick.volume.value = -6;
const snare = new Tone.NoiseSynth({
  noise: { type: "white" },
  envelope: { attack: 0.001, decay: 0.2, sustain: 0.01, release: 0.4 }
}).toDestination();
snare.volume.value = -4;
const hihat = new Tone.NoiseSynth({
  noise: { type: "pink" },
  envelope: { attack: 0.005, decay: 0.05, sustain: 0.001, release: 0.05 }
}).toDestination();
hihat.volume.value = -10;
const bassSynth = new Tone.Synth({
  oscillator: { type: "triangle" },
  envelope: { attack: 0.01, decay: 0.4, sustain: 0.1, release: 0.7 }
}).toDestination();
bassSynth.volume.value = -3;
const guitar = new Tone.PluckSynth().toDestination();
guitar.volume.value = -8;
const strings = new Tone.PolySynth(Tone.Synth, {
  oscillator: { type: "triangle" },
  envelope: { attack: 1.5, decay: 2, sustain: 0.7, release: 3 }
}).toDestination();
strings.volume.value = -10;
const piano = new Tone.Sampler({
  urls: { A1: "A1.mp3", C2: "C2.mp3" },
  release: 2,
  baseUrl: "https://tonejs.github.io/audio/salamander/"
}).toDestination();
piano.volume.value = -8;
const harp = new Tone.Synth({
  oscillator: { type: "triangle" },
  envelope: { attack: 0.01, decay: 1.2, sustain: 0.2, release: 2.5 }
}).toDestination();
harp.volume.value = -12;
const lowDownSynth = new Tone.Synth({
  oscillator: { type: "sine" },
  envelope: { attack: 0.01, decay: 0.2, sustain: 0.2, release: 0.5 }
}).toDestination();
lowDownSynth.volume.value = -2;

// --- Setup global sequences and parts for playback ---
drums = new Tone.Sequence((time, step) => {
  if (typeof step !== 'number') return;
  if (step % 4 === 0) kick.triggerAttackRelease("C1", "4n", time);
  if (step % 4 === 2) snare.triggerAttackRelease("C1", "4n", time);
  hihat.triggerAttackRelease("C1", "8n", time);
}, [0, 1, 2, 3, 4, 5, 6, 7], "8n");
drums.loop = true;
drums.loopEnd = "2m";
bassLine = new Tone.Sequence((time, note) => {
  if (typeof note === 'string') bassSynth.triggerAttackRelease(note, "2n", time);
}, ["Bb2", "Eb2", "F2", "Bb2"], "2n");
bassLine.loop = true;
bassLine.loopEnd = "2m";
guitarArp = new Tone.Sequence((time, note) => {
  if (typeof note === 'string') guitar.triggerAttackRelease(note, "16n", time, 0.5);
}, ["Bb4", "Db5", "F5", "Bb5", "F5", "Db5", "Bb4", "F4"], "8n");
guitarArp.loop = true;
guitarArp.loopEnd = "1m";
stringPart = new Tone.Part((time, chord) => {
  if (Array.isArray(chord) && chord.every(n => typeof n === 'string')) {
    strings.triggerAttackRelease(chord, "1m", time, 0.3);
  }
}, [
  ["0:0:0", ["Bb3", "Db4", "F4"]],
  ["1:0:0", ["Gb3", "Bb3", "Db4"]],
  ["2:0:0", ["Db3", "F3", "Ab3"]],
  ["3:0:0", ["Ab3", "C4", "Eb4"]]
]);
stringPart.loop = true;
stringPart.loopEnd = "4m";
pianoPart = new Tone.Part((time, chord) => {
  if (Array.isArray(chord) && chord.every(n => typeof n === 'string')) {
    piano.triggerAttackRelease(chord, "2n", time, 0.4);
  }
}, [
  ["0:0:0", ["Bb3", "Db4", "F4"]],
  ["1:0:0", ["Gb3", "Bb3", "Db4"]],
  ["2:0:0", ["Db3", "F3", "Ab3"]],
  ["3:0:0", ["Ab3", "C4", "Eb4"]]
]);
pianoPart.loop = true;
pianoPart.loopEnd = "4m";
harpArp = new Tone.Sequence((time, note) => {
  if (typeof note === 'string') harp.triggerAttackRelease(note, "8n", time, 0.2);
}, ["Bb4", "Db5", "F5", "Ab5", "F5", "Db5", "Bb4", "F4"], "4n");
harpArp.loop = true;
harpArp.loopEnd = "2m";
lowDownSeq = new Tone.Sequence((time, note) => {
  if (typeof note === 'string') lowDownSynth.triggerAttackRelease(note, "2n", time, 0.5);
}, ["Bb1", null, "Bb1", null, "F1", null, "Bb1", null], "2n");
lowDownSeq.loop = true;
lowDownSeq.loopEnd = "2m";

async function createOfflineSong(destination, transport) {
  const { kick, snare, hihat, bassSynth, guitar, strings, piano, harp, lowDownSynth } = await createSynths(destination);
  const drums = new Tone.Sequence((time, step) => {
    if (typeof step !== 'number') return;
    if (step % 4 === 0) kick.triggerAttackRelease("C1", "4n", time);
    if (step % 4 === 2) snare.triggerAttackRelease("C1", "4n", time);
    hihat.triggerAttackRelease("C1", "8n", time);
  }, [0, 1, 2, 3, 4, 5, 6, 7], "8n");
  drums.loop = true;
  drums.loopEnd = "2m";
  const bassPattern = ["Bb2", "Eb2", "F2", "Bb2"];
  const bassLine = new Tone.Sequence((time, note) => {
    if (typeof note === 'string') bassSynth.triggerAttackRelease(note, "2n", time);
  }, bassPattern, "2n");
  bassLine.loop = true;
  bassLine.loopEnd = "2m";
  const guitarNotes = ["Bb4", "Db5", "F5", "Bb5", "F5", "Db5", "Bb4", "F4"];
  const guitarArp = new Tone.Sequence((time, note) => {
    if (typeof note === 'string') guitar.triggerAttackRelease(note, "16n", time, 0.5);
  }, guitarNotes, "8n");
  guitarArp.loop = true;
  guitarArp.loopEnd = "1m";
  const stringChords = [
    ["Bb3", "Db4", "F4"],
    ["Gb3", "Bb3", "Db4"],
    ["Db3", "F3", "Ab3"],
    ["Ab3", "C4", "Eb4"]
  ];
  const stringPart = new Tone.Part((time, chord) => {
    if (Array.isArray(chord) && chord.every(n => typeof n === 'string')) {
      strings.triggerAttackRelease(chord, "1m", time, 0.3);
    }
  }, [
    ["0:0:0", stringChords[0]],
    ["1:0:0", stringChords[1]],
    ["2:0:0", stringChords[2]],
    ["3:0:0", stringChords[3]]
  ]);
  stringPart.loop = true;
  stringPart.loopEnd = "4m";
  const pianoChords = [
    ["Bb3", "Db4", "F4"],
    ["Gb3", "Bb3", "Db4"],
    ["Db3", "F3", "Ab3"],
    ["Ab3", "C4", "Eb4"]
  ];
  const pianoPart = new Tone.Part((time, chord) => {
    if (Array.isArray(chord) && chord.every(n => typeof n === 'string')) {
      piano.triggerAttackRelease(chord, "2n", time, 0.4);
    }
  }, [
    ["0:0:0", pianoChords[0]],
    ["1:0:0", pianoChords[1]],
    ["2:0:0", pianoChords[2]],
    ["3:0:0", pianoChords[3]]
  ]);
  pianoPart.loop = true;
  pianoPart.loopEnd = "4m";
  const harpNotes = ["Bb4", "Db5", "F5", "Ab5", "F5", "Db5", "Bb4", "F4"];
  const harpArp = new Tone.Sequence((time, note) => {
    if (typeof note === 'string') harp.triggerAttackRelease(note, "8n", time, 0.2);
  }, harpNotes, "4n");
  harpArp.loop = true;
  harpArp.loopEnd = "2m";
  const lowDownPattern = ["Bb1", null, "Bb1", null, "F1", null, "Bb1", null];
  const lowDownSeq = new Tone.Sequence((time, note) => {
    if (typeof note === 'string') lowDownSynth.triggerAttackRelease(note, "2n", time, 0.5);
  }, lowDownPattern, "2n");
  lowDownSeq.loop = true;
  lowDownSeq.loopEnd = "2m";
  transport.bpm.value = BPM;
  drums.start(0);
  bassLine.start(0);
  guitarArp.start(0);
  stringPart.start(0);
  pianoPart.start(0);
  harpArp.start(0);
  lowDownSeq.start(0);
  transport.start(0);
}

// --- Download WAV functionality ---
async function loadWaveFile() {
  if (!window.wavefile) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'wavefile.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }
}

async function encodeAndDownloadWav(buffer) {
  await loadWaveFile();
  // Convert Tone.js AudioBuffer to 16-bit PCM WAV using wavefile
  const channelData = [];
  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channelData.push(buffer.getChannelData(i));
  }
  // Interleave channels if stereo, else just use mono
  let interleaved;
  if (channelData.length === 2) {
    interleaved = new Float32Array(channelData[0].length * 2);
    for (let i = 0, j = 0; i < channelData[0].length; i++, j += 2) {
      interleaved[j] = channelData[0][i];
      interleaved[j + 1] = channelData[1][i];
    }
  } else {
    interleaved = channelData[0];
  }
  // Convert Float32 to 16-bit PCM
  function floatTo16BitPCM(input) {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      let s = Math.max(-1, Math.min(1, input[i]));
      output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return output;
  }
  const wav = new window.wavefile.WaveFile();
  wav.fromScratch(
    channelData.length, // number of channels
    buffer.sampleRate,
    '16',
    channelData.map(floatTo16BitPCM)
  );
  const wavBuffer = wav.toBuffer();
  const blob = new Blob([wavBuffer], { type: 'audio/wav' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Muisckm.wav';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

document.getElementById('playBtn').addEventListener('click', async () => {
  await piano.loaded;
  await Tone.start();
  Tone.Transport.stop();
  Tone.Transport.cancel();
  Tone.Transport.position = 0;
  drums.start(0);
  bassLine.start(0);
  guitarArp.start(0);
  stringPart.start(0);
  pianoPart.start(0);
  harpArp.start(0);
  lowDownSeq.start(0);
  Tone.Transport.start();
  setTimeout(() => {
    Tone.Transport.stop();
  }, 30000);
});

document.getElementById('downloadBtn').addEventListener('click', async () => {
  await piano.loaded;
  const duration = 30; // seconds
  const sampleRate = 44100;
  const buffer = await Tone.Offline(async ({ transport, destination }) => {
    createOfflineSong(destination, transport);
  }, duration, { sampleRate });
  await encodeAndDownloadWav(buffer);
});

// Add a check to stop all sequences on stop

document.getElementById('stopBtn').addEventListener('click', () => {
  Tone.Transport.stop();
  Tone.Transport.cancel();
  drums.stop();
  bassLine.stop();
  guitarArp.stop();
  stringPart.stop();
  pianoPart.stop();
  harpArp.stop();
  lowDownSeq.stop();
});
