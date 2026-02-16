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
    this.canvas.width = 1920;
    this.canvas.height = 1080;

    this.visualizer = butterchurn.createVisualizer(audioContext, this.canvas, {
      width: 1920,
      height: 1080,
      pixelRatio: window.devicePixelRatio || 1,
      textureRatio: 1,
    });

    this.visualizer.connectAudio(source);
    this.loadRandomPreset();

    // Força o ajuste inicial
    this.resize();
  }

  render() {
    if (this.visualizer) {
      this.visualizer.render();
    }
  }

  resize() {
    this.visualizer.setRendererSize(1920, 1080);
  }

  loadRandomPreset() {
    if (!this.visualizer) return;
    const randomKey =
      this.presetKeys[Math.floor(Math.random() * this.presetKeys.length)];
    this.visualizer.loadPreset(this.presets[randomKey], 2.7);
  }
}
