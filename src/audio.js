export class AudioController {
  constructor() {
    this.audioContext = new (
      window.AudioContext || window.webkitAudioContext
    )();
    this.source = null;
  }

  async setupAudio(file, audioElement) {
    // Resume AudioContext if it was suspended (browser policy)
    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }

    // Create a URL for the file and load it into the player
    audioElement.src = URL.createObjectURL(file);

    // Create MediaElementSource only once to avoid errors
    if (!this.source) {
      this.source = this.audioContext.createMediaElementSource(audioElement);
      this.source.connect(this.audioContext.destination);
    }

    return {
      context: this.audioContext,
      source: this.source,
    };
  }
}
