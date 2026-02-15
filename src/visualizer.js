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
    // Create the Visualizer instance
    this.visualizer = butterchurn.createVisualizer(audioContext, this.canvas, {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: window.devicePixelRatio || 1,
      textureRatio: 1,
    });

    // Connect audio
    this.visualizer.connectAudio(source);

    // Load initial random preset
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

  // --- Preset Management ---

  loadPresetByIndex(index) {
    if (!this.visualizer) return;

    const presetKey = this.presetKeys[index];
    const preset = this.presets[presetKey];

    // Load preset with a 2.7 second transition (blend)
    this.visualizer.loadPreset(preset, 2.7);

    return presetKey; // Return the name to update UI
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
