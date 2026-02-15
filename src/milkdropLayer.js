import butterchurn from "butterchurn";
import butterchurnPresets from "butterchurn-presets";

export class MilkdropLayer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.visualizer = null;
    this.presets = butterchurnPresets.getPresets();
    this.presetKeys = Object.keys(this.presets);
  }

  init(audioContext, source) {
    this.visualizer = butterchurn.createVisualizer(audioContext, this.canvas, {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: window.devicePixelRatio || 1,
      textureRatio: 1,
    });
    this.visualizer.connectAudio(source);
    this.loadRandomPreset();
  }

  render() {
    if (this.visualizer) this.visualizer.render();
  }

  resize() {
    if (this.visualizer)
      this.visualizer.setRendererSize(window.innerWidth, window.innerHeight);
  }

  loadRandomPreset() {
    if (!this.visualizer) return;
    const randomKey =
      this.presetKeys[Math.floor(Math.random() * this.presetKeys.length)];
    this.visualizer.loadPreset(this.presets[randomKey], 2.7);
  }
}
