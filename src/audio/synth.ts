// 1996 Retro Tamagotchi 8-bit Web Audio Synthesizer

class TamagotchiSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.25;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  private playTone(freq: number, duration: number, type: OscillatorType = 'square', delay: number = 0, volMultiplier: number = 1) {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const startTime = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      const targetVol = this.volume * volMultiplier;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(targetVol, startTime + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch {
      // Ignore audio errors if browser blocks autoplay before user interaction
    }
  }

  // Button A Click (Cycle/Select)
  public soundSelect() {
    this.playTone(920, 0.045, 'square', 0, 0.8);
  }

  // Button B Click (Confirm / Execute)
  public soundConfirm() {
    this.playTone(1100, 0.045, 'square', 0, 0.9);
    this.playTone(1650, 0.065, 'square', 0.05, 1.0);
  }

  // Button C Click (Cancel / Back)
  public soundCancel() {
    this.playTone(480, 0.08, 'square', 0, 0.8);
  }

  // Attention Alert Beep (Two iconic piercing beeps)
  public soundAlert() {
    this.playTone(1760, 0.1, 'square', 0, 1.1);
    this.playTone(1760, 0.1, 'square', 0.16, 1.1);
  }

  // Eating munch sound
  public soundEat() {
    for (let i = 0; i < 3; i++) {
      this.playTone(600 + i * 150, 0.04, 'square', i * 0.09, 0.7);
    }
  }

  // Mini-game win cheering fanfare
  public soundCheer() {
    const notes = [523, 659, 784, 1046]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      this.playTone(freq, 0.08, 'square', idx * 0.07, 0.9);
    });
  }

  // Mini-game miss buzz
  public soundFail() {
    this.playTone(320, 0.08, 'square', 0, 0.8);
    this.playTone(280, 0.12, 'square', 0.08, 0.8);
  }

  // Cleaning water flush sound
  public soundFlush() {
    const freqs = [880, 740, 600, 480, 360, 300];
    freqs.forEach((freq, idx) => {
      this.playTone(freq, 0.05, 'triangle', idx * 0.04, 0.9);
    });
  }

  // Medicine syringe healing sound
  public soundHeal() {
    const freqs = [440, 554, 659, 880, 1108];
    freqs.forEach((freq, idx) => {
      this.playTone(freq, 0.06, 'sine', idx * 0.06, 0.85);
    });
  }

  // Egg hatching fanfare!
  public soundHatch() {
    const melody = [523, 659, 784, 880, 987, 1046, 1318];
    melody.forEach((freq, idx) => {
      this.playTone(freq, 0.09, 'square', idx * 0.08, 1.0);
    });
  }

  // Evolution chime
  public soundEvolve() {
    const melody = [440, 554, 659, 880, 987, 1174, 1318, 1568];
    melody.forEach((freq, idx) => {
      this.playTone(freq, 0.07, 'square', idx * 0.06, 1.0);
    });
  }

  // Death / R.I.P chime
  public soundDeath() {
    const notes = [440, 415, 392, 349];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 0.22, 'square', idx * 0.2, 0.8);
    });
  }
}

export const sound = new TamagotchiSoundEngine();
