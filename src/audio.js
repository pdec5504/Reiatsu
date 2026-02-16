export class AudioController {
  constructor() {
    this.audioContext = new (
      window.AudioContext || window.webkitAudioContext
    )();
    this.source = null;
    this.analyser = null;
    this.audioBuffer = null;

    this.startTime = 0;
    this.pausedAt = 0;
    this.isPlaying = false;
    this.duration = 0;
  }

  async setupAudio(file) {
    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }

    const arrayBuffer = await file.arrayBuffer();
    this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    this.duration = this.audioBuffer.duration;

    this.pausedAt = 0;
    this.isPlaying = false;

    return {
      context: this.audioContext,
      duration: this.duration,
    };
  }

  play() {
    if (this.isPlaying) return;

    this.source = this.audioContext.createBufferSource();
    this.source.buffer = this.audioBuffer;

    this.analyser = this.audioContext.createAnalyser();

    this.source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);

    this.source.start(0, this.pausedAt);

    this.startTime = this.audioContext.currentTime - this.pausedAt;

    this.isPlaying = true;

    this.source.onended = () => {
      if (this.Math_getCurrentTime() >= this.duration - 0.1) {
        this.isPlaying = false;
        this.pausedAt = 0;
      }
    };

    return { source: this.source, analyser: this.analyser };
  }

  pause() {
    if (!this.source || !this.isPlaying) return;

    try {
      this.source.stop();
    } catch (e) {}

    this.pausedAt = this.audioContext.currentTime - this.startTime;
    this.isPlaying = false;
    this.source = null;
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      return this.play();
    }
  }

  seek(timeInSeconds) {
    const wasPlaying = this.isPlaying;

    if (this.isPlaying) {
      this.source.stop();
      this.source = null;
    }

    this.pausedAt = Math.max(0, Math.min(timeInSeconds, this.duration));

    if (wasPlaying) {
      this.isPlaying = false;
      return this.play();
    }
    return null;
  }

  getCurrentTime() {
    if (this.isPlaying) {
      return this.audioContext.currentTime - this.startTime;
    }
    return this.pausedAt;
  }

  stop() {
    if (this.source) {
      try {
        this.source.stop();
      } catch (e) {}
      this.source.disconnect();
      this.source = null;
    }
    this.isPlaying = false;
    this.pausedAt = 0;
  }
}
