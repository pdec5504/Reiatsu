import butterchurn from "butterchurn";
import butterchurnPresets from "butterchurn-presets";

export class VisualizerEngine {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.visualizer = null;
    this.presets = butterchurnPresets.getPresets();
    this.presetKeys = Object.keys(this.presets);
    this.currentPresetIndex = 0;
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
    if (this.visualizer) {
      this.visualizer.render();
    }
  }

  resize() {
    if (this.visualizer) {
      this.visualizer.setRendererSize(window.innerWidth, window.innerHeight);
    }
  }

  loadPresetByIndex(index) {
    if (!this.visualizer) return;

    const presetKey = this.presetKeys[index];
    const preset = this.presets[presetKey];

    this.visualizer.loadPreset(preset, 2.7);

    return presetKey;
  }

  loadRandomPreset() {
    this.currentPresetIndex = Math.floor(
      Math.random() * this.presetKeys.length,
    );
    return this.loadPresetByIndex(this.currentPresetIndex);
  }

  nextPreset() {
    this.currentPresetIndex =
      (this.currentPresetIndex + 1) % this.presetKeys.length;
    return this.loadPresetByIndex(this.currentPresetIndex);
  }

  prevPreset() {
    this.currentPresetIndex =
      (this.currentPresetIndex - 1 + this.presetKeys.length) %
      this.presetKeys.length;
    return this.loadPresetByIndex(this.currentPresetIndex);
  }
}
