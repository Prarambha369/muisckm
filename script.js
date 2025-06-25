// Node.js version of the script
(async () => {
  const Tone = (await import('tone')).default;  // Correctly access Tone's default export
  // await Tone.start();  // Commented out as not needed in Node.js offline rendering
  const wavefileModule = await import('wavefile');
  const wavefile = wavefileModule.default;  // Keep wavefile import as is for now
  const fs = await import('fs');  // Use dynamic import for fs named exports

  // Set Tone context with node-web-audio-api polyfill
  const { AudioContext } = await import('node-web-audio-api');
  Tone.setContext(new AudioContext());

  // Define BPM
  const BPM = 144;
  const transport = Tone.getTransport();
  transport.bpm.value = BPM;

  async function createOfflineSong(destination, transport) {
    console.log('Starting offline rendering with duration 30s and sampleRate 44100');
    // Synths are already created globally for simplicity in Node.js
    console.log('Synths ready for offline use');

    // Define sequences and parts within offline context
    const drums = new Tone.Sequence((time, step) => {
      if (typeof step !== 'number') return;
      if (step % 4 === 0) kick.triggerAttackRelease("C1", "4n", time);
      if (step % 4 === 2) snare.triggerAttackRelease("C1", "4n", time);
      hihat.triggerAttackRelease("C1", "8n", time);
    }, [0, 1, 2, 3, 4, 5, 6, 7], "8n");
    drums.loop = true;
    drums.loopEnd = "2m";
    drums.start(0);

    const bassLine = new Tone.Sequence((time, note) => {
      if (typeof note === 'string') bassSynth.triggerAttackRelease(note, "2n", time);
    }, ["Bb2", "Eb2", "F2", "Bb2"], "2n");
    bassLine.loop = true;
    bassLine.loopEnd = "2m";
    bassLine.start(0);

    const guitarArp = new Tone.Sequence((time, note) => {
      if (typeof note === 'string') guitar.triggerAttackRelease(note, "16n", time, 0.5);
    }, ["Bb4", "Db5", "F5", "Bb5", "F5", "Db5", "Bb4", "F4"], "8n");
    guitarArp.loop = true;
    guitarArp.loopEnd = "1m";
    guitarArp.start(0);

    const stringPart = new Tone.Part((time, chord) => {
      try {
        if (Array.isArray(chord) && chord.every(n => typeof n === 'string')) {
          strings.triggerAttackRelease(chord, "1m", time, 0.3);
        }
      } catch (error) {
        console.error('Error in stringPart callback with chord:', chord, error);
      }
    }, [["0:0:0", ["Bb3", "Db4", "F4"]], ["1:0:0", ["Gb3", "Bb3", "Db4"]], ["2:0:0", ["Db3", "F3", "Ab3"]], ["3:0:0", ["Ab3", "C4", "Eb4"]]]);
    stringPart.loop = true;
    stringPart.loopEnd = "4m";
    stringPart.start(0);

    const pianoPart = new Tone.Part((time, chord) => {
      try {
        if (Array.isArray(chord) && chord.every(n => typeof n === 'string')) {
          piano.triggerAttackRelease(chord, "2n", time, 0.4);
        }
      } catch (error) {
        console.error('Error in pianoPart callback with chord:', chord, error);
      }
    }, [["0:0:0", ["Bb3", "Db4", "F4"]], ["1:0:0", ["Gb3", "Bb3", "Db4"]], ["2:0:0", ["Db3", "F3", "Ab3"]], ["3:0:0", ["Ab3", "C4", "Eb4"]]]);
    pianoPart.loop = true;
    pianoPart.loopEnd = "4m";
    pianoPart.start(0);

    const harpArp = new Tone.Sequence((time, note) => {
      if (typeof note === 'string') harp.triggerAttackRelease(note, "8n", time, 0.2);
    }, ["Bb4", "Db5", "F5", "Ab5", "F5", "Db5", "Bb4", "F4"], "4n");
    harpArp.loop = true;
    harpArp.loopEnd = "2m";
    harpArp.start(0);

    const lowDownSeq = new Tone.Sequence((time, note) => {
      if (typeof note === 'string') lowDownSynth.triggerAttackRelease(note, "2n", time, 0.5);
    }, ["Bb1", null, "Bb1", null, "F1", null, "Bb1", null], "2n");
    lowDownSeq.loop = true;
    lowDownSeq.loopEnd = "2m";
    lowDownSeq.start(0);

    transport.start(0);
  }

  async function encodeAndDownloadWav(buffer) {
    const wav = new wavefile.WaveFile();
    const channelData = [];
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      const data = buffer.getChannelData(i);
      channelData.push(new Int16Array(data.length).map((_, index) => data[index] * 32767 | 0));
    }
    wav.fromScratch(buffer.numberOfChannels, buffer.sampleRate, '16', channelData);
    const wavBuffer = wav.toBuffer();
    fs.default.writeFileSync('output.wav', Buffer.from(wavBuffer));
    console.log('WAV file saved as output.wav in the current directory');
  }

  // Main execution block
  console.log('Starting WAV generation for Muisckm song');
  const duration = 30; // seconds
  const sampleRate = 44100;
  const offlineBuffer = await Tone.Offline(async (context) => {
    console.log('Offline context started with duration:', duration, 'seconds');
    // Test oscillator to ensure rendering
    const testOsc = new Tone.Oscillator('A4').toDestination();
    testOsc.start(0);
    testOsc.stop(duration);
    console.log('Test oscillator scheduled');
    const transport = Tone.getTransport();
    transport.bpm.value = BPM;
    const kick = new Tone.MembraneSynth({ pitchDecay: 0.05, octaves: 10, envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 } }).toDestination();
    kick.volume.value = -6;
    const snare = new Tone.NoiseSynth({ noise: { type: "white" }, envelope: { attack: 0.001, decay: 0.2, sustain: 0.01, release: 0.4 } }).toDestination();
    snare.volume.value = -4;
    const hihat = new Tone.NoiseSynth({ noise: { type: "pink" }, envelope: { attack: 0.005, decay: 0.05, sustain: 0.001, release: 0.05 } }).toDestination();
    hihat.volume.value = -10;
    const bassSynth = new Tone.Synth({ oscillator: { type: "triangle" }, envelope: { attack: 0.01, decay: 0.4, sustain: 0.1, release: 0.7 } }).toDestination();
    bassSynth.volume.value = -3;
    const guitar = new Tone.PluckSynth().toDestination();
    guitar.volume.value = -8;
    const strings = new Tone.PolySynth(Tone.Synth, { oscillator: { type: "triangle" }, envelope: { attack: 1.5, decay: 2, sustain: 0.7, release: 3 } }).toDestination();
    strings.volume.value = -10;
    const piano = new Tone.PolySynth(Tone.Synth, { oscillator: { type: "triangle" }, envelope: { attack: 0.01, decay: 0.1, sustain: 0.5, release: 1 } }).toDestination();
    piano.volume.value = -8;
    const harp = new Tone.Synth({ oscillator: { type: "triangle" }, envelope: { attack: 0.01, decay: 1.2, sustain: 0.2, release: 2.5 } }).toDestination();
    harp.volume.value = -12;
    const lowDownSynth = new Tone.Synth({ oscillator: { type: "sine" }, envelope: { attack: 0.01, decay: 0.2, sustain: 0.2, release: 0.5 } }).toDestination();
    lowDownSynth.volume.value = -2;
    await createOfflineSong(context.destination, transport);
    console.log('Offline rendering completed');
  }, duration, { sampleRate });
  await encodeAndDownloadWav(offlineBuffer);
})().catch(err => console.error('Error generating WAV file:', err));
