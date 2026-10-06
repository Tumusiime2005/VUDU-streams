/**
 * Web Audio engine for VUDU
 * Provides studio-grade synthesized thunderclap & lightning audio,
 * plus interactive synthesized music stream with audio visualizer analysis.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Triggers a cinematic lightning thunderclap:
 * 1. Initial high-voltage lightning whip/crack
 * 2. Heavy explosive sub-bass pressure wave
 * 3. Rolling thunder rumble with resonance
 */
export function playThunderboltSound(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // 1. Initial lightning crack (Noise transient + sharp bandpass)
    const bufferSize = ctx.sampleRate * 2.5;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const crackFilter = ctx.createBiquadFilter();
    crackFilter.type = 'bandpass';
    crackFilter.frequency.setValueAtTime(1400, now);
    crackFilter.frequency.exponentialRampToValueAtTime(180, now + 0.35);
    crackFilter.Q.setValueAtTime(4.0, now);

    const crackGain = ctx.createGain();
    crackGain.gain.setValueAtTime(0, now);
    crackGain.gain.linearRampToValueAtTime(0.85, now + 0.015);
    crackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    whiteNoise.connect(crackFilter);
    crackFilter.connect(crackGain);
    crackGain.connect(ctx.destination);

    // 2. Rolling Thunder Low-Pass Rumble
    const rumbleNoise = ctx.createBufferSource();
    rumbleNoise.buffer = noiseBuffer;

    const rumbleFilter = ctx.createBiquadFilter();
    rumbleFilter.type = 'lowpass';
    rumbleFilter.frequency.setValueAtTime(320, now);
    rumbleFilter.frequency.exponentialRampToValueAtTime(60, now + 2.2);

    const rumbleGain = ctx.createGain();
    rumbleGain.gain.setValueAtTime(0, now);
    rumbleGain.gain.linearRampToValueAtTime(0.7, now + 0.06);
    rumbleGain.gain.exponentialRampToValueAtTime(0.3, now + 0.6);
    rumbleGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

    rumbleNoise.connect(rumbleFilter);
    rumbleFilter.connect(rumbleGain);
    rumbleGain.connect(ctx.destination);

    // 3. Sub-bass shockwave boom (60Hz down to 24Hz)
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.exponentialRampToValueAtTime(28, now + 0.8);

    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0, now);
    subGain.gain.linearRampToValueAtTime(0.9, now + 0.03);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(subGain);
    subGain.connect(ctx.destination);

    // Start all
    whiteNoise.start(now);
    rumbleNoise.start(now);
    osc.start(now);

    whiteNoise.stop(now + 2.5);
    rumbleNoise.stop(now + 2.5);
    osc.stop(now + 1.5);
  } catch (err) {
    console.warn('Thunder sound playback skipped:', err);
  }
}

/**
 * Music Synth Engine for real-time music playback
 */
class VuduSynthPlayer {
  private isPlaying = false;
  private timer: number | null = null;
  private step = 0;
  private masterGain: GainNode | null = null;
  public analyser: AnalyserNode | null = null;
  private currentGenre: string = 'Electronic';
  private tempo: number = 118; // BPM

  public start(genre: string = 'Electronic', volume: number = 0.8) {
    const ctx = getAudioContext();
    this.stop();
    this.isPlaying = true;
    this.currentGenre = genre;
    this.step = 0;

    if (!this.masterGain) {
      this.masterGain = ctx.createGain();
      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.masterGain.connect(this.analyser);
      this.analyser.connect(ctx.destination);
    }

    this.masterGain.gain.setValueAtTime(volume, ctx.currentTime);

    // Adjust tempo according to genre
    if (genre.toLowerCase().includes('rock')) this.tempo = 130;
    else if (genre.toLowerCase().includes('hip-hop')) this.tempo = 92;
    else if (genre.toLowerCase().includes('pop')) this.tempo = 120;
    else this.tempo = 118;

    const interval = (60 / this.tempo / 4) * 1000; // 16th note in ms
    this.timer = window.setInterval(() => {
      if (this.isPlaying) {
        this.tick();
        this.step = (this.step + 1) % 16;
      }
    }, interval);
  }

  public setVolume(volume: number) {
    if (this.masterGain && audioCtx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), audioCtx.currentTime);
    }
  }

  private tick() {
    if (!this.isPlaying || !this.masterGain) return;
    const ctx = getAudioContext();
    const t = ctx.currentTime;

    // Bass drum on steps 0, 4, 8, 12
    if (this.step % 4 === 0) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.frequency.setValueAtTime(130, t);
      osc.frequency.exponentialRampToValueAtTime(35, t + 0.12);
      g.gain.setValueAtTime(0.7, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.22);
    }

    // Snare / clap on steps 4, 12
    if (this.step === 4 || this.step === 12) {
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const f = ctx.createBiquadFilter();
      f.type = 'highpass';
      f.frequency.setValueAtTime(1000, t);

      const g = ctx.createGain();
      g.gain.setValueAtTime(0.35, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

      noise.connect(f);
      f.connect(g);
      g.connect(this.masterGain);
      noise.start(t);
      noise.stop(t + 0.15);
    }

    // Hi-hat on even steps
    if (this.step % 2 === 0) {
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const f = ctx.createBiquadFilter();
      f.type = 'highpass';
      f.frequency.setValueAtTime(7000, t);
      const g = ctx.createGain();
      g.gain.setValueAtTime(this.step % 4 === 2 ? 0.18 : 0.08, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      noise.connect(f);
      f.connect(g);
      g.connect(this.masterGain);
      noise.start(t);
      noise.stop(t + 0.045);
    }

    // Synth Melody / Arpeggio notes
    const notes = [220, 261.63, 329.63, 392, 440, 523.25]; // Am pentatonic
    if (this.step % 2 === 1 || this.step % 3 === 0) {
      const note = notes[(this.step * 3) % notes.length];
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = this.currentGenre.includes('Rock') ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(note, t);

      g.gain.setValueAtTime(0.12, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.22);
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  public getVisualizerData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(16);
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }
}

export const synthPlayer = new VuduSynthPlayer();
