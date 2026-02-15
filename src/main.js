import { AudioController } from "./audio.js";
import { VisualizerEngine } from "./visualizer.js";

const fileInput = document.getElementById("audio-file");
const audioPlayer = document.getElementById("audio-player");
const canvas = document.getElementById("visualizer-canvas");
const btnNext = document.getElementById("btn-next-preset");
const btnPrev = document.getElementById("btn-prev-preset");
const presetNameLabel = document.getElementById("current-preset-name");
const statusText = document.getElementById("status-text");

const audioCtrl = new AudioController();
const vizEngine = new VisualizerEngine(canvas);

let isPlaying = false;

fileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    statusText.innerText = "Loading Audio...";

    const { context, source } = await audioCtrl.setupAudio(file, audioPlayer);

    vizEngine.init(context, source);

    const initialPreset = vizEngine.loadRandomPreset();
    updatePresetName(initialPreset);

    audioPlayer.play();
    statusText.innerText = "Playing";

    if (!isPlaying) {
      isPlaying = true;
      animationLoop();
    }
  } catch (error) {
    console.error("Error initializing:", error);
    statusText.innerText = "Error";
  }
});

btnNext.addEventListener("click", () => {
  if (isPlaying) {
    const name = vizEngine.nextPreset();
    updatePresetName(name);
  }
});

btnPrev.addEventListener("click", () => {
  if (isPlaying) {
    const name = vizEngine.prevPreset();
    updatePresetName(name);
  }
});

window.addEventListener("resize", () => {
  vizEngine.resize();
});

function animationLoop() {
  requestAnimationFrame(animationLoop);
  vizEngine.render();
}

function updatePresetName(name) {
  if (name) {
    presetNameLabel.innerText = name;
  }
}
