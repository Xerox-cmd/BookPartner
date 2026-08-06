class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeNodes: (AudioNode | number)[] = [];
  private isPlaying = false;
  private timerId: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime + 0.1);
    }
  }

  public startSound(type: 'fireplace' | 'rain' | 'piano' | 'breeze' = 'fireplace') {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    this.stopSound();
    this.isPlaying = true;

    if (type === 'fireplace') {
      this.playFireplace();
    } else if (type === 'rain') {
      this.playRain();
    } else if (type === 'breeze') {
      this.playBreeze();
    } else if (type === 'piano') {
      this.playPiano();
    }
  }

  public stopSound() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.activeNodes.forEach(node => {
      if (typeof node !== 'number' && 'stop' in node) {
        try {
          (node as AudioScheduledSourceNode).stop();
        } catch {}
      }
    });
    this.activeNodes = [];
  }

  private playFireplace() {
    if (!this.ctx || !this.masterGain) return;

    // 1. FIREPLACE RUMBLE BED (Lowpass noise)
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const fireNoise = this.ctx.createBufferSource();
    fireNoise.buffer = buffer;
    fireNoise.loop = true;

    const fireFilter = this.ctx.createBiquadFilter();
    fireFilter.type = 'lowpass';
    fireFilter.frequency.setValueAtTime(320, this.ctx.currentTime);

    const fireGain = this.ctx.createGain();
    fireGain.gain.setValueAtTime(0.14, this.ctx.currentTime);

    fireNoise.connect(fireFilter);
    fireFilter.connect(fireGain);
    fireGain.connect(this.masterGain);

    fireNoise.start();
    this.activeNodes.push(fireNoise);

    // 2. SUBTLE WHISTLING WIND LAYER (Bandpass modulated noise for window breeze)
    const windNoise = this.ctx.createBufferSource();
    windNoise.buffer = buffer;
    windNoise.loop = true;

    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.setValueAtTime(520, this.ctx.currentTime);
    windFilter.Q.setValueAtTime(3.8, this.ctx.currentTime); // resonant whistling tone

    const windGain = this.ctx.createGain();
    windGain.gain.setValueAtTime(0.06, this.ctx.currentTime);

    windNoise.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(this.masterGain);

    windNoise.start();
    this.activeNodes.push(windNoise);

    // 3. FIREPLACE CRACKLE & POP EFFECT
    const triggerPop = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      
      const popOsc = this.ctx.createOscillator();
      const popGain = this.ctx.createGain();

      popOsc.type = Math.random() > 0.4 ? 'triangle' : 'sawtooth';
      popOsc.frequency.setValueAtTime(350 + Math.random() * 900, this.ctx.currentTime);
      popOsc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.035);

      const vol = 0.04 + Math.random() * 0.16;
      popGain.gain.setValueAtTime(vol, this.ctx.currentTime);
      popGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.035);

      popOsc.connect(popGain);
      popGain.connect(this.masterGain);

      popOsc.start();
      popOsc.stop(this.ctx.currentTime + 0.04);
    };

    // Timer loop for crackle pops and gentle wind whistling pitch shifts
    let phase = 0;
    this.timerId = window.setInterval(() => {
      if (!this.ctx || !this.isPlaying) return;
      
      // Fire crackle pops
      if (Math.random() > 0.25) {
        triggerPop();
      }

      // Smooth whistling wind pitch frequency modulation
      phase += 0.12;
      const targetWindFreq = 480 + Math.sin(phase) * 180 + Math.sin(phase * 0.4) * 90;
      const targetWindGain = 0.04 + Math.abs(Math.sin(phase * 0.5)) * 0.05;
      
      windFilter.frequency.linearRampToValueAtTime(targetWindFreq, this.ctx.currentTime + 0.15);
      windGain.gain.linearRampToValueAtTime(targetWindGain, this.ctx.currentTime + 0.15);
    }, 120);
  }

  private playRain() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
    filter.Q.setValueAtTime(0.8, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
    this.activeNodes.push(noise);
  }

  private playBreeze() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
    this.activeNodes.push(noise);

    // LFO frequency sweep for wind swelling
    this.timerId = window.setInterval(() => {
      if (!this.ctx || !this.isPlaying) return;
      const targetFreq = 180 + Math.sin(Date.now() / 2000) * 120;
      filter.frequency.linearRampToValueAtTime(targetFreq, this.ctx.currentTime + 0.5);
    }, 500);
  }

  private playPiano() {
    if (!this.ctx || !this.masterGain) return;

    const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C4 major pentatonic
    
    const playChord = () => {
      if (!this.ctx || !this.isPlaying || !this.masterGain) return;
      
      const note = notes[Math.floor(Math.random() * notes.length)];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 3.5);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 3.6);
    };

    playChord();
    this.timerId = window.setInterval(() => {
      playChord();
    }, 2800);
  }
}

export const audioSynthesizer = new AudioSynthesizer();
