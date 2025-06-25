import fs from 'fs';
import path from 'path';
import * as Tone from 'tone'; // Corrected import for Tone.js
import WavEncoder from 'wav-encoder';

async function main() {
  const BPM = 144;
  // Tone.Transport.bpm.value = BPM; // This line is moved inside Tone.Offline

  // Initialize all synths without .toDestination() for offline rendering
  const kick = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 10,
    envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 }
  });
  kick.volume.value = -6;

  const snare = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.001, decay: 0.2, sustain: 0.01, release: 0.4 }
  });
  snare.volume.value = -4;

  const hihat = new Tone.NoiseSynth({
    noise: { type: "pink" },
    envelope: { attack: 0.005, decay: 0.05, sustain: 0.001, release: 0.05 }
  });
  hihat.volume.value = -10;

  const bassSynth = new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: { attack: 0.01, decay: 0.4, sustain: 0.1, release: 0.7 }
  });
  bassSynth.volume.value = -3;

  const guitar = new Tone.PluckSynth();
  guitar.volume.value = -8;

  const strings = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "triangle" },
    envelope: { attack: 1.5, decay: 2, sustain: 0.7, release: 3 }
  });
  strings.volume.value = -10;

  const piano = new Tone.Sampler({
    urls: { A1: "A1.mp3", C2: "C2.mp3" },
    release: 2,
    baseUrl: "https://tonejs.github.io/audio/salamander/"
  });
  piano.volume.value = -8;

  const harp = new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: { attack: 0.01, decay: 1.2, sustain: 0.2, release: 2.5 }
  });
  harp.volume.value = -12;

  const lowDownSynth = new Tone.Synth({
    oscillator: { type: "sine" },
    envelope: { attack: 0.01, decay: 0.2, sustain: 0.2, release: 0.5 }
  });
  lowDownSynth.volume.value = -2;

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

  const duration = 30;
  const sampleRate = 44100;

  // Use Tone.Offline to render to an AudioBuffer
  const buffer = await Tone.Offline(async ({ transport, destination }) => {
    transport.bpm.value = BPM;
    kick.connect(destination);
    snare.connect(destination);
    hihat.connect(destination);
    bassSynth.connect(destination);
    guitar.connect(destination);
    strings.connect(destination);
    harp.connect(destination);
    lowDownSynth.connect(destination);
    drums.start(0);
    bassLine.start(0);
    guitarArp.start(0);
    stringPart.start(0);
    pianoPart.start(0);
    harpArp.start(0);
    lowDownSeq.start(0);
    transport.start(0);
  }, duration, { sampleRate });

  const channelData = [];
  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channelData.push(buffer.getChannelData(i));
  }
  const wavData = {
    sampleRate: buffer.sampleRate,
    channelData
  };
  const downloadsDir = process.env.HOME ? path.join(process.env.HOME, 'Downloads') : './';
  const outPath = path.join(downloadsDir, 'Muisckm.wav');
  await WavEncoder.encode(wavData).then(buffer => {
    fs.writeFileSync(outPath, Buffer.from(buffer));
  });
  console.log('WAV file saved to:', outPath);
}

main();
